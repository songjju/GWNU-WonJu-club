from django.test import TestCase
from django.urls import reverse
from .models import CustomUser
from rest_framework.test import APIClient
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core import mail
import re

class PasswordResetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            email='ssj4358@naver.com',
            password='testpassword',
            name='Test User',
            student_id=12345678,
            grade=1,
            study='Computer Science',
            gender='남자',
            phone='010-1234-5678'
        )

    def test_password_reset_request(self):
        response = self.client.post(reverse('rest_password_reset'), {'email': self.user.email})
        self.assertEqual(response.status_code, 200)

    def test_password_reset_confirm(self):
        self.client.post(reverse('rest_password_reset'), {'email': self.user.email})

        self.assertEqual(len(mail.outbox), 1)
        email_body = mail.outbox[0].body

        print("\n\nEMAIL BODY:\n", email_body)  # 여기!!

        # 이메일에서 uid/token 추출
        match = re.search(r'confirm/([\w-]+)/([\w-]+)', email_body)
        self.assertIsNotNone(match, msg="UID/token not found in email body")

        uid, token = match.groups()

        response = self.client.post(reverse('rest_password_reset_confirm'), {
            'uid': uid,
            'token': token,
            'new_password1': 'NewPassword123!',
            'new_password2': 'NewPassword123!',
        })

        print("RESPONSE DATA:", response.data)
        self.assertEqual(response.status_code, 200)
