from rest_framework import status
from rest_framework.decorators import APIView
from rest_framework.generics import *
from rest_framework.response import Response
from rest_framework.permissions import *
from rest_framework.authtoken.models import Token
from club_management.permissions import IsPresidentOrAdmin
from club_management.serializer import *
from club_introduce.models import *
from club_account.models import *
import os
import base64
from urllib.parse import unquote
from backend import settings
from django.utils import timezone
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.core.signing import Signer
from django.conf import settings
from rest_framework.exceptions import NotFound


class ClubManageListView(APIView):
    permission_classes = [IsPresidentOrAdmin]
    def get(self, request):
        token_key = request.headers.get('Authorization')
        if not token_key:
            return Response({'error': 'Authorization header is missing'}, status=401)

        try:
            token = token_key.split(' ')[1]
        except IndexError:
            return Response({'error': 'Invalid Authorization header format'}, status=401)

        try:
            # 토큰이 유효한지 확인하는 부분
            token_obj = Token.objects.get(key=token)
        except Token.DoesNotExist:
            return Response({'error': 'Invalid token'}, status=401)

        user_id = token_obj.user.id

        try:
            # 사용자의 id 값을 이용하여 CustomUser 모델에서 해당 사용자를 찾습니다.
            user = CustomUser.objects.get(id=user_id)
            # 사용자의 student_id 값을 가져옵니다.
            user_student_id = user.student_id

            # ClubMember 모델에서 해당하는 student_id 값을 가진 클럽 멤버를 찾습니다.
            club_members = ClubMember.objects.filter(student_id=user_student_id)

            if not club_members.exists():
                return Response({'error': 'Club not found for the given student ID'}, status=404)

            # Serialize the club members
            serializer = ClubListSerializer(club_members, many=True)
            return Response(serializer.data)
        except get_user_model().DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
# Create your views here.
class ClubManagementHomeView(RetrieveAPIView):
    serializer_class = ClubSerializer
    permission_classes = [IsPresidentOrAdmin]

    def get(self, *args, **kwargs):
        """
        동아리 관리 페이지 홈
        """
        club_name = self.kwargs.get('club_name')
        try:
            club_manage = Club.objects.get(club_name=club_name)
        except Club.DoesNotExist:
            raise NotFound(detail="동아리 관리정보를 가져올 수 없습니다.")

        club_info = self.get_serializer(club_manage).data
        existing_members = ClubSerializer.get_existing_members(club_name)
        applying_members = ClubSerializer.get_applying_members(club_name)

        response = {
            'club_info': club_info,
            'existing_members': existing_members,
            'applying_members': applying_members
        }
        return Response(response, status=status.HTTP_200_OK)

class MemberApproveAPIView(APIView):
    serializer_class = ClubMemberSerializer
    permission_classes = [IsPresidentOrAdmin]
    http_method_names = ['delete', 'patch']

    def get_object(self, club_name, id):
        """객체를 안전하게 가져오기 - Response 대신 예외 발생"""
        try:
            return ClubMember.objects.get(id=id, club_name=club_name)
        except ClubMember.DoesNotExist:
            raise NotFound(detail='No ClubMember found matching the given query.')
        except ClubMember.MultipleObjectsReturned:
            raise NotFound(detail='Multiple ClubMembers found. Please specify unique identifier.')

    def delete(self, request, club_name, id):
        """신규 회원 거부"""
        member = self.get_object(club_name, id)
        member.delete()
        return Response({"message": "신청을 거부했습니다."}, status=status.HTTP_204_NO_CONTENT)

    def patch(self, request, club_name, id):
        """신규 회원 승인"""
        member = self.get_object(club_name, id)
        member.joined_date = timezone.now()
        member.save()

        serializer = ClubMemberSerializer(member, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        return Response({'message': '승인이 완료되었습니다.'}, status=status.HTTP_200_OK)

class MemberManagement(APIView):
    serializer_class = ClubMemberSerializer
    permission_classes = [IsPresidentOrAdmin]

    def get_object(self, club_name, id):
        """객체를 안전하게 가져오기 - Response 대신 예외 발생"""
        try:
            return ClubMember.objects.get(id=id, club_name=club_name)
        except ClubMember.DoesNotExist:
            raise NotFound(detail='해당 동아리 멤버를 찾을 수 없습니다.')
        except ClubMember.MultipleObjectsReturned:
            raise NotFound(detail='Multiple ClubMembers found. Please specify unique identifier.')

    def patch(self, request, club_name, id):
        """멤버 직책 수정"""
        member = self.get_object(club_name, id)
        member.job = request.data.get('role', member.job)
        member.save()

        serializer = ClubMemberSerializer(member, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        return Response({'message': '직책 수정이 완료되었습니다.'}, status=status.HTTP_200_OK)

    def delete(self, request, club_name, id):
        """멤버 퇴출"""
        presidents_count = ClubMember.objects.filter(club_name=club_name, job='회장').count()
        
        member = self.get_object(club_name, id)
        
        # 회장이 2명 미만이면 삭제 불가
        if member.job == "회장" and presidents_count < 2:
            return Response({'error': '회장이 2명 미만입니다.'}, status=status.HTTP_400_BAD_REQUEST)

        member.delete()
        return Response({"message": "퇴출에 성공했습니다."}, status=status.HTTP_204_NO_CONTENT)

class ImageCorrectionDelete(APIView):
    permission_classes = [IsPresidentOrAdmin]
    http_method_names = ['get', 'patch', 'delete', 'post']

    def _sign_url(self, url):
        signer = Signer()
        return signer.sign(url)

    def get(self, request, club_name):
        club_name = club_name.replace(' ', '_')

        image = request.GET.get('image')
        directory_path = ''

        if image == 'logo':
            directory_path = os.path.join(settings.MEDIA_ROOT, 'logos')
        elif image == 'photo':
            directory_path = os.path.join(settings.MEDIA_ROOT, 'photos')

        try:
            image_files = os.listdir(directory_path)
            matching_files = [file_name for file_name in image_files if file_name.startswith(club_name)]

            if not matching_files:
                return Response({'error': f'No {image} found for {club_name}.'}, status=status.HTTP_404_NOT_FOUND)

            image_data = []
            for file_name in matching_files:
                file_path = os.path.join(directory_path, file_name)
                with open(file_path, 'rb') as image_file:
                    encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
                image_data.append({'file_name': file_name, 'data': encoded_image})

            return Response({'images': image_data}, status=status.HTTP_200_OK)

        except FileNotFoundError:
            return Response({'error': f'Directory for {club_name} not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, club_name):
        """
        동아리 로고, 사진 수정
        """

        club = Club.objects.get(club_name=club_name)
        file = request.FILES.get('image')

        if not file:
            return Response({'error': 'File is required.'}, status=status.HTTP_400_BAD_REQUEST)

        image_name = unquote(os.path.basename(file.name)).replace('"', '')
        image_type = image_name.split('_')[-1].split('.')[0]

        if image_type == 'logo':
            logo_path = os.path.join(settings.MEDIA_ROOT, 'logos', image_name)
            if os.path.exists(logo_path):
                club.logo = logo_path
                club.save()
                with open(logo_path, 'rb') as logo_file:
                    encoded_logo = base64.b64encode(logo_file.read()).decode('utf-8')
                return Response({
                    'success': 'Logo updated successfully.',
                    'logo': encoded_logo
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Logo file does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        elif image_type == 'photo':
            photo_path = os.path.join(settings.MEDIA_ROOT, 'photos', image_name)
            if os.path.exists(photo_path):
                club.photo = photo_path
                club.save()
                with open(photo_path, 'rb') as photo_file:
                    encoded_photo = base64.b64encode(photo_file.read()).decode('utf-8')
                return Response({
                    'success': 'Photo updated successfully.',
                    'photo': encoded_photo
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Logo file does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'message': 'Logo updated successfully.', 'new_logo': club.logo.url}, status=status.HTTP_200_OK)

    def delete(self, request, club_name):
        """
        동아리 로고, 사진 삭제
        """
        club = Club.objects.get(club_name=club_name)
        file = request.data.get('image')

        if not file:
            return Response({'error': 'File name is required.'}, status=status.HTTP_400_BAD_REQUEST)

        image_name = unquote(os.path.basename(file)).replace('"', '')
        image_type = image_name.split('_')[-1].split('.')[0]

        if image_type == 'logo':
            file_path = os.path.join(settings.MEDIA_ROOT, 'logos', image_name)
        elif image_type == 'photo':
            file_path = os.path.join(settings.MEDIA_ROOT, 'photos', image_name)
        else:
            return Response({'error': 'Invalid image type provided.'}, status=status.HTTP_400_BAD_REQUEST)

        if not os.path.exists(file_path):
            return Response({'error': 'File does not exist in the specified directory.'}, status=status.HTTP_404_NOT_FOUND)
            # 삭제를 시도하기 전에 파일이 존재하는지 확인
        if not default_storage.exists(file_path):
            return Response({'error': 'File does not exist in the specified directory.'},
                            status=status.HTTP_404_NOT_FOUND)
        try:
            # 파일 삭제
            default_storage.delete(file_path)

            # 기본 로고 경로 설정
            default_logo_path = os.path.join(settings.MEDIA_ROOT, 'logos', 'default.jpg')
            # 기본 사진 경로 설정
            default_photo_path = os.path.join(settings.MEDIA_ROOT, 'photos', 'default.jpg')

            if club.logo == file_path:
                club.logo = default_logo_path
                club.save()
                with open(default_logo_path, 'rb') as file:
                    encoded_logo = base64.b64encode(file.read()).decode('utf-8')
                return Response({
                    'success': 'Image deleted successfully.',
                    'logo': encoded_logo
                })
            if club.photo == file_path:
                club.photo = default_photo_path
                club.save()
                with open(default_photo_path, 'rb') as file:
                    encoded_photo = base64.b64encode(file.read()).decode('utf-8')
                return Response({
                    'success': 'Image deleted successfully.',
                    'photo': encoded_photo
                })

            club.save()
            return Response({'message:' '삭제가 완료되었습니다.'}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, club_name):
        """
        동아리 로고, 사진 추가
        """
        image = request.FILES.get('image')

        image_name = image.name

        first_name = image_name.replace("_", " ")
        image_type = image_name.split("_")[-1].split(".")[0]

        if not image:
            return Response({'message': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)

        if not (first_name.startswith(club_name)) or image_type not in ['logo', 'photo']:
            return Response({'message': '''파일 명이 맞지 않습니다. 
                예시) 동아리 이름: Art Club 이미지 분류: logo 파일 명: Art_Club_free_logo 또는 Art_Club_one_logo'''}, status=status.HTTP_400_BAD_REQUEST)

        if image_type == 'logo':
            directory_path = os.path.join(settings.MEDIA_ROOT, 'logos')
        elif image_type == 'photo':
            directory_path = os.path.join(settings.MEDIA_ROOT, 'photos')

        full_path = os.path.join(directory_path, image_name)

        # 이미지 파일이 존재하는지 확인
        if os.path.exists(full_path):
            return Response({'message': '이미지 파일이 이미 존재합니다.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            default_storage.save(full_path, ContentFile(image.read()))
        except Exception as e:
            return Response({'message': f'Error saving image: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'message': 'Image uploaded successfully', 'file_name': image_name}, status=status.HTTP_200_OK)

class IntroductionCorrection(APIView):
    """동아리 소개글 수정"""
    permission_classes = [IsPresidentOrAdmin]
    
    def patch(self, request, club_name):
        introduction = request.data.get('introduction')
        
        if introduction:
            try:
                club = Club.objects.get(club_name=club_name)
                club.introducation = introduction
                club.save()
                return Response({
                    'message': '소개글을 성공적으로 수정했습니다.',
                    'introduction': introduction
                }, status=status.HTTP_200_OK)
            except Club.DoesNotExist:
                return Response({'error': '동아리를 찾을 수 없습니다.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': '소개글이 포함되지 않았습니다.'}, status=status.HTTP_400_BAD_REQUEST)

class DeleteClub(APIView):
    """동아리 삭제"""
    permission_classes = [IsPresidentOrAdmin]

    def delete(self, request, club_name):
        try:
            club = Club.objects.get(club_name=club_name)
            club.delete()
            return Response({"message": f"동아리 '{club_name}' 삭제 완료."}, status=status.HTTP_204_NO_CONTENT)
        except Club.DoesNotExist:
            return Response({"error": "해당 동아리가 존재하지 않습니다."}, status=status.HTTP_404_NOT_FOUND)
