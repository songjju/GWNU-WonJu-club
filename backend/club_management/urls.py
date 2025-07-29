from django.urls import path, re_path
from club_management.views import *
from rest_framework import permissions

urlpatterns = [

    # 동아리 관리 목록
    path('', ClubManageListView.as_view(), name='club-list'),
    
    # 동아리 관리 홈
    path('club/<str:club_name>/', ClubManagementHomeView.as_view(), name='club-home'),
    
    # 멤버 승인/거부
    path('club/<str:club_name>/member/<int:id>/', MemberApproveAPIView.as_view(), name='member-approve'),
    
    # 멤버 관리 (직책 수정/퇴출)
    path('club/<str:club_name>/management/<int:id>/', MemberManagement.as_view(), name='member-management'),
    
    # 소개글 수정
    path('club/<str:club_name>/introducation/', IntroductionCorrection.as_view(), name='introduction-correction'),
    
    # 이미지 수정
    path('club/<str:club_name>/images/', ImageCorrectionDelete.as_view(), name='logo-correction-delete'),
    
    # 동아리 삭제
    path('club/<str:club_name>/delete/', DeleteClub.as_view(), name='club-delete'),
]