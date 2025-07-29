from rest_framework import serializers
from .models import *

class ClubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Club
        fields = '__all__'

class ApplyClubSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClubMember
        fields = '__all__'

class ClubCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Club
        fields = '__all__'

    def create(self, validated_data):
        validated_data['new_club'] = True
        return super().create(validated_data)


class MyClubListSerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField('get_logo')
    member_id = serializers.SerializerMethodField('get_id')
    job = serializers.SerializerMethodField('get_job')

    def get_logo(self, obj):
        return obj.logo.url if obj.logo else None

    def get_id(self, obj):  # club_member 의 id를 가져오기 위한 함수
        try:
            # 중복 멤버십 방지를 위해 가장 최근 멤버십만 가져오기
            return obj.clubmember_set.filter(student_id=self.context['request'].user).first().id
        except AttributeError:
            return None
    def get_job(self, obj):
        try:
            member = obj.clubmember_set.filter(student_id=self.context['request'].user).first()
            return member.job if member else None
        except AttributeError:
            return None

    class Meta:
        model = Club
        fields = ['member_id', 'club_name', 'job', 'logo']


class CountClubCategorySerializer(serializers.Serializer):
    category = serializers.CharField(max_length=20)
    count = serializers.IntegerField()

class CountClubTypeSerializer(serializers.Serializer):
    type = serializers.CharField(max_length=20)
    count = serializers.IntegerField()


