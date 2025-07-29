from django.db import models
from django.core.exceptions import ValidationError
from club_account.models import CustomUser

def club_logo_directory_path(instance, filename):
    # 파일 저장 경로를 'MEDIA_ROOT/club_name/logo/'로 설정
    return 'club/logo/'

def club_photo_directory_path(instance: object, filename: object) -> object:
    # 파일 저장 경로를 'MEDIA_ROOT/club_name/photo/'로 설정
    return 'club/photo/'

class Club(models.Model):
    class Meta:
        verbose_name = '동아리'
        verbose_name_plural = '동아리들'

    club_name = models.CharField(max_length=20, primary_key=True)
    category = models.CharField(max_length=20)
    type = models.CharField(max_length=20)
    introducation = models.TextField()
    photo = models.ImageField(upload_to=club_photo_directory_path, null=True)
    logo = models.ImageField(upload_to=club_logo_directory_path, null=True)
    new_club = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

class ClubDetail(models.Model):
    club = models.OneToOneField(Club, on_delete=models.CASCADE, primary_key=True, related_name='details')
    join = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    activity = models.TextField()
    fee = models.CharField(max_length=100)

    def __str__(self):
        return f"Details of {self.club.club_name}"


class ClubMember(models.Model):
    class Meta:
        verbose_name = '동아리 회원'
        verbose_name_plural = '동아리 회원들'
    
    club_name = models.ForeignKey('Club', on_delete=models.CASCADE, to_field='club_name', null=True)
    student_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE, to_field='student_id')
    joined_date = models.DateTimeField(null=True)  # null=True로 변경
    job = models.CharField(max_length=5, default='일반회원')

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)