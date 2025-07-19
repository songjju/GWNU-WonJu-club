from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import UserDetailsSerializer, PasswordChangeSerializer
from allauth.account.utils import setup_user_email
from allauth.account.adapter import get_adapter
from club_account.models import CustomUser
from django.contrib.auth import get_user_model

class CustomRegisterSerializer(RegisterSerializer):
    name = serializers.CharField(max_length=30)
    student_id = serializers.IntegerField()
    grade = serializers.IntegerField()
    study = serializers.CharField(max_length=20)
    gender = serializers.CharField(max_length=10)
    phone = serializers.CharField(max_length=15)

    def get_cleaned_data(self):
        cleaned_data = super().get_cleaned_data()
        cleaned_data['name'] = self.validated_data.get('name', '')
        cleaned_data['student_id'] = self.validated_data.get('student_id', 0)
        cleaned_data['grade'] = self.validated_data.get('grade', 0)
        cleaned_data['study'] = self.validated_data.get('study', '')
        cleaned_data['gender'] = self.validated_data.get('gender', '남자')
        cleaned_data['phone'] = self.validated_data.get('phone', 0)
        return cleaned_data

    def custom_signup(self, request, user):
        user.name = self.cleaned_data.get('name')
        user.student_id = self.cleaned_data.get('student_id')
        user.grade = self.cleaned_data.get('grade')
        user.study = self.cleaned_data.get('study')
        user.gender = self.cleaned_data.get('gender')
        user.phone = self.cleaned_data.get('phone')
        user.save()
        return user

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
    
        # 중복 검사를 먼저 수행
        User = get_user_model()
        if User.objects.filter(email=self.cleaned_data['email']).exists():
            raise serializers.ValidationError("이 이메일은 이미 사용 중입니다.")
        if User.objects.filter(student_id=self.cleaned_data['student_id']).exists():
            raise serializers.ValidationError("이 학번은 이미 사용 중입니다.")
    
        # 검사 통과 후 저장
        adapter.save_user(request, user, self, True)
        self.custom_signup(request, user)
        setup_user_email(request, user, [])
        return user


class CustomUserDetailsSerializer(UserDetailsSerializer):
    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + \
                 ('name', 'student_id', 'grade', 'study', 'gender', 'phone',)
