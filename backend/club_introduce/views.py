from rest_framework import status
from rest_framework.decorators import APIView
from rest_framework.response import Response
from rest_framework.permissions import *
from club_introduce.serializer import *
from club_introduce.models import *
from rest_framework import generics
from django.utils import timezone
from django.db.models import Count


# Create your views here.
class ClubListAPIView(APIView):
    """
    동아리 목록 조회 및 생성
    - GET: 누구나 조회 가능 (공개 정보)
    - POST: 인증된 사용자만 동아리 생성 가능
    """
    def get_permissions(self):
        """
        GET 요청은 AllowAny, POST 요청은 IsAuthenticated
        """
        if self.request.method == 'GET':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        
        return [permission() for permission in permission_classes]

    def get(self, request):
        clubs = Club.objects.exclude(club_name="FreeBoard")
        clubs_data = ClubSerializer(clubs, many=True).data
        return Response(clubs_data)

    def post(self, request):
        serializer = ClubSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryClubAPIView(APIView):
    """동아리 카테고리별 조회 - 공개 정보"""
    permission_classes = [AllowAny]

    def get(self, request, category_id, type_id):
        # 빈 문자열 처리
        if category_id == '':
            category_id = None
        if type_id == '':
            type_id = None

        queryset = Club.objects.exclude(club_name="FreeBoard")
        
        if category_id:
            queryset = queryset.filter(category=category_id)
        if type_id:
            queryset = queryset.filter(type=type_id)

        if not queryset.exists():
            return Response({'error': '카테고리에 해당하는 동아리가 존재하지 않습니다.'}, status=status.HTTP_404_NOT_FOUND)

        clubs_data = ClubSerializer(queryset, many=True).data
        return Response(clubs_data)


class ApplyClubAPIView(APIView):
    """동아리 가입 신청 - 인증 필요"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        club_name = request.data.get('club_name')
        user = request.user

        # AnonymousUser 체크 추가
        if not user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            club = Club.objects.get(club_name=club_name)
        except Club.DoesNotExist:
            return Response({'error': 'Club not found.'}, status=status.HTTP_404_NOT_FOUND)

        if ClubMember.objects.filter(club_name=club, student_id=user, joined_date__isnull=True).exists():
            return Response({'message': '가입신청이 되어 있습니다.'}, status=status.HTTP_400_BAD_REQUEST)

        if ClubMember.objects.filter(club_name=club, student_id=user, joined_date__isnull=False).exists():
            return Response({'message': '동아리 회원입니다.'}, status=status.HTTP_400_BAD_REQUEST)

        ClubMember.objects.create(club_name=club, student_id=user, joined_date=None)
        return Response({'message': '가입신청이 완료되었습니다.'}, status=status.HTTP_200_OK)

class CreateClub(generics.CreateAPIView):
    """동아리 생성 - 인증 필요"""
    permission_classes = [IsAuthenticated]
    queryset = Club.objects.all()
    serializer_class = ClubCreateSerializer

    def create(self, request, *args, **kwargs):
        user = self.request.user
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        if not user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        # 동아리 만든사람을 동아리 회장으로 만듬
        club_name = Club.objects.get(club_name=serializer.data['club_name'])
        club_member = ClubMember(club_name=club_name, student_id=user, joined_date=timezone.now(), job='회장')
        club_member.save()

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class MyClubListView(generics.ListAPIView):
    """내 동아리 목록 - 인증 필요"""
    permission_classes = [IsAuthenticated]
    serializer_class = MyClubListSerializer
    queryset = Club.objects.all()

    def get_queryset(self):
        user = self.request.user

        # AnonymousUser 체크 추가
        if not user.is_authenticated:
            return Club.objects.none()  # 빈 쿼리셋 반환
        
        return Club.objects.filter(clubmember__student_id=user, clubmember__joined_date__isnull=False)

class DropClubView(generics.DestroyAPIView):
    """동아리 탈퇴 - 인증 필요"""
    permission_classes = [IsAuthenticated]
    queryset = ClubMember.objects.all()

    def destroy(self, request, *args, **kwargs):
        job = request.data.get('job')
        member_id = kwargs.get('member_id')

        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)


        try:
            instance = ClubMember.objects.get(pk=member_id)
        except ClubMember.DoesNotExist:
            return Response({"error": "Club member not found"}, status=status.HTTP_404_NOT_FOUND)

        if job == '회장':
            return Response({"error": "동아리 회장은 탈퇴못함"}, status=status.HTTP_400_BAD_REQUEST)
        
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class CountClubCategoryView(generics.ListAPIView):
    """동아리 카테고리별 통계 - 공개 정보"""
    permission_classes = [AllowAny]
    serializer_class = CountClubCategorySerializer

    def get_queryset(self):
        return Club.objects.exclude(club_name="FreeBoard").values('category').annotate(count=Count('category'))

class CountClubTypeView(generics.ListAPIView):
    """동아리 타입별 통계 - 공개 정보"""
    permission_classes = [AllowAny]
    serializer_class = CountClubTypeSerializer

    def get_queryset(self):
        return Club.objects.exclude(club_name="FreeBoard").values('type').annotate(count=Count('type'))
