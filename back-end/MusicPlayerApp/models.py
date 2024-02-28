from django.db import models

# Create your models here.
    
class Music(models.Model):
    musicID = models.AutoField(primary_key=True)
    musicName = models.CharField(max_length=100)
    musicUrl = models.CharField(max_length=100, null=True, blank=True)
    musicAuthor = models.CharField(max_length=100, null=True, blank=True)

class UserRole(models.Model):
    username = models.CharField(max_length=100,primary_key=True)
    role = models.CharField(max_length=100, default="user")
    firstname = models.CharField(max_length=100, default="user")
    lastname = models.CharField(max_length=100, default="user")

class MusicList(models.Model):
    musicListId = models.AutoField(primary_key=True)
    musicListName = models.CharField(max_length=100, default='favourite')
    musicListProfilePic = models.CharField(max_length=100, null=True, blank=True)
    userBelongTo = models.ForeignKey(UserRole, on_delete=models.CASCADE, related_name="music_lists")
    musicIn = models.ManyToManyField(Music)
    