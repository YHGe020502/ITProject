from rest_framework import serializers
from MusicPlayerApp.models import UserRole, MusicList
from django.db import transaction


class MusicListSerializer(serializers.ModelSerializer):
    class Meta:
        model = MusicList
        fields = ('musicListId', 'musicListName', 'userBelongTo', 'musicIn')

class UserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = ('username', 
                  'role',
                  'firstname',
                  'lastname')

    def validate_username(self, value):
        return value.lower()
    
    def validate_firstname(self, value):
        return value.lower()
    
    def validate_lastname(self, value):
        return value.lower()

    def create(self, validated_data):
        try:
            with transaction.atomic():
                # create the user role instance
                user_instance = UserRole.objects.create(**validated_data)
                
                # create the five default music lists for this user
                if user_instance.role == "family_member":
                    MusicList.objects.create(musicListName="Favourite", userBelongTo=user_instance)
                    MusicList.objects.create(musicListName="Morning Motivation", userBelongTo=user_instance, musicListProfilePic="MorningMotivation.jpg")
                    MusicList.objects.create(musicListName="Daily Activity", userBelongTo=user_instance, musicListProfilePic="DailyActivity.png")
                    MusicList.objects.create(musicListName="Afternoon Relaxation", userBelongTo=user_instance, musicListProfilePic="AfternoonRelaxation.jpg")
                    MusicList.objects.create(musicListName="Sleep Preparation", userBelongTo=user_instance, musicListProfilePic="SleepPreparation.jpg")
        except Exception as e:
            print(f"Error creating user and music lists: {str(e)}")

        return user_instance
