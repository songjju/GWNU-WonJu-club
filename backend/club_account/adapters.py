from allauth.account.adapter import DefaultAccountAdapter
from django.contrib.auth import get_user_model

class CustomAccountAdapter(DefaultAccountAdapter):
    
    def save_user(self, request, user, form, commit=True):
        # 기본 저장 필드: username, email
        user = super().save_user(request, user, form, False)  # commit=False로 변경
        data = form.cleaned_data

        user.name = data.get('name')
        user.student_id = data.get("student_id")
        user.grade = data.get("grade")
        user.study = data.get("study")
        user.gender = data.get("gender")
        user.phone = data.get("phone")

        if commit:
            user.save()
        return user