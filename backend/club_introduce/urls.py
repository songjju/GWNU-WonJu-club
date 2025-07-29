from django.urls import path, re_path
from club_introduce import views


urlpatterns = [
    # 실제 API 엔드포인트
    path('club_list/', views.ClubListAPIView.as_view(), name='club-list'),
    # 빈 문자열도 허용하도록 정규식 패턴 + 마지막 슬래시 추가
    re_path(r'^club_list/category_club/(?P<category_id>[^/]*)/(?P<type_id>[^/]*)/?$', views.CategoryClubAPIView.as_view(), name='category-club'),
    path('apply_club/', views.ApplyClubAPIView.as_view(), name='joined-club'),
    path('create_club/', views.CreateClub.as_view(), name='create-club'),
    path('myclub_list/', views.MyClubListView.as_view(), name='my-club-list'),
    path('drop_club/<int:member_id>/', views.DropClubView.as_view(), name='drop-club'),  # 마지막 슬래시 추가
    path('count_club_category/', views.CountClubCategoryView.as_view(), name='count-club-category'),
    path('count_club_type/', views.CountClubTypeView.as_view(), name='count-club-type'),
]