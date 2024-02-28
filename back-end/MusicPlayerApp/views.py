from django. shortcuts import render

from django.views.decorators.csrf import csrf_exempt

from rest_framework.parsers import JSONParser

from django.http.response import JsonResponse

from MusicPlayerApp.models import MusicList,Music,UserRole

from MusicPlayerApp.serializers import MusicListSerializer,MusicSerializer

from django.core.files.storage import default_storage

from rest_framework_simplejwt.tokens import RefreshToken

from django.http import HttpResponseBadRequest

from google.cloud import storage
from datetime import datetime, timedelta
from google.cloud import storage


import os
from django.conf import settings

json_file_path = os.path.join(settings.BASE_DIR, 'corded-evening-400913-ce5bbb69ae1e.json')

client = storage.Client.from_service_account_json(json_file_path)


MIME_TO_EXTENSION = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif'
}

BUCKET_NAME = 'cdsquad'


@csrf_exempt
def musicApi(request,id=0):
    refresh = RefreshToken.for_user(request.user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

    if request.method=='GET':
        musics = Music.objects.all()
        music_serializer = MusicSerializer(musics, many=True) 
        return JsonResponse ({
            'data': music_serializer.data,
            'access_token': access_token,
            'refresh_token': refresh_token
        }, safe=False)
    # add music
    elif request.method=='POST':
        musics_data=JSONParser().parse(request)
        musics_serializer = MusicSerializer(data=musics_data) 
        if musics_serializer.is_valid():
            musics_serializer.save()
            return JsonResponse({
                'message': "Added Successfully!!",
                'access_token': access_token,
                'refresh_token': refresh_token
            } , safe=False)
        return JsonResponse({
            'message': "Failed to Add.",
            'access_token': access_token,
            'refresh_token': refresh_token
        }, safe=False)

    elif request.method=='PUT':
        musics_data = JSONParser().parse(request)
        music = Music.objects.get(MusicID=musics_data['MusicID']) 
        musics_serializer = MusicSerializer(music, data=musics_data)
        if musics_serializer.is_valid():
            musics_serializer.save()
            return JsonResponse({
            'message': "Updated Successfully!!",
            'access_token': access_token,
            'refresh_token': refresh_token
        }, safe=False) 
        return JsonResponse({
            'message': "Failed to Update.",
            'access_token': access_token,
            'refresh_token': refresh_token
        }, safe=False) 

    elif request.method=='DELETE':
        music = Music.objects.get(MusicID=id)
        music.delete()
        return JsonResponse ({
            'message':"Deleted Successfully!!",
            'access_token': access_token,
            'refresh_token': refresh_token
        }, safe=False)
    


# get picture URL
def get_signed_url_for_blob(bucketName, blobName):
    storageClient = client
    bucket = storageClient.bucket(bucketName)
    blob = bucket.blob(blobName)
    urlExpiration = datetime.now() + timedelta(minutes=5)
    return blob.generate_signed_url(expiration=urlExpiration, method='GET')


def generate_upload_signed_url(bucketName, blobName, fileType):
    storageClient = client
    bucket = storageClient.bucket(bucketName)
    blob = bucket.blob(blobName)
    
    urlExpiration = datetime.now() + timedelta(minutes=30)

    signedUrl = blob.generate_signed_url(
        expiration=urlExpiration,
        method='PUT',
        content_type = fileType
    )

    return signedUrl




@csrf_exempt
def musiclistApi(request):
    # Generate tokens
    refresh = RefreshToken.for_user(request.user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

    if request.method == 'PATCH':
        # Extract username from request data
        data = JSONParser().parse(request)
        username = data.get('username')

        if not username:
            return JsonResponse({
                'message': 'Username not provided.',
                'access_token': access_token,
                'refresh_token': refresh_token
            }, status=400)

        try:
            user = UserRole.objects.get(username=username)
        except UserRole.DoesNotExist:
            return JsonResponse({
                'message': 'User not found.',
                'access_token': access_token,
                'refresh_token': refresh_token
            }, status=404)

        # get Music List
        musiclists = MusicList.objects.filter(userBelongTo=username)[:5]

        # Update the musicListProfilePic for each musicList with the signed URL.
        for musiclist in musiclists:
            if musiclist.musicListProfilePic:
                blob_name = "MusicList Pic/" + musiclist.musicListProfilePic
                signed_url = get_signed_url_for_blob(BUCKET_NAME, blob_name)
                musiclist.musicListProfilePic = signed_url

        musiclist_serializer = MusicListSerializer(musiclists, many=True)
        
        return JsonResponse({
            'data': musiclist_serializer.data,
            'access_token': access_token,
            'refresh_token': refresh_token
        }, safe=False, status=200)
    
    # add Music
    elif request.method == 'POST':
        musiclist_data = JSONParser().parse(request)
        musicId = musiclist_data.get("MusicID")
        musicListId = musiclist_data.get("MusicListID")
        try:
            music = Music.objects.get(musicID = musicId)
            musiclist = MusicList.objects.get(musicListId = musicListId)
            musiclist.musicIn.add(music)
            return JsonResponse({
                'message': "Added Successfully!!",
                'access_token': access_token,
                'refresh_token': refresh_token
            }, safe=False, status = 200)
        except:
            return JsonResponse({
                'message': "Failed to Add.",
                'access_token': access_token,
                'refresh_token': refresh_token
            }, safe=False, status = 404)
    
    # update picture
    elif request.method == 'PUT':
        musiclist_data = JSONParser().parse(request)
        musicPic = musiclist_data.get("MusicPic")
        musicListId = musiclist_data.get("MusicListID")

        try:
            musiclist = MusicList.objects.get(musicListId = musicListId)

            musiclist.musicListProfilePic = musicPic
            musiclist.save()

            return JsonResponse({
                'message': "MusicList Picture Updated Successfully!!",
                'access_token': access_token,
                'refresh_token': refresh_token
            }, safe=False, status=200)

        except MusicList.DoesNotExist:
            return JsonResponse({
                'message': "MusicList not found.",
                'access_token': access_token,
                'refresh_token': refresh_token
            }, safe=False, status=404)
        except:
            return JsonResponse({
                'message': "Failed to Update MusicList Picture.",
                'access_token': access_token,
                'refresh_token': refresh_token
            }, safe=False, status=500)


    elif request.method == 'DELETE':
        musiclist_data = JSONParser().parse(request)
        musicId = musiclist_data.get("MusicID")
        musicListId = musiclist_data.get("MusicListID")
        
        try:
            music = Music.objects.get(musicID=musicId)
            musiclist = MusicList.objects.get(musicListId=musicListId)

            # remove music
            musiclist.musicIn.remove(music)

            return JsonResponse({
                'message': "Deleted Successfully!!",
                'access_token': access_token,
                'refresh_token': refresh_token
            }, safe=False, status=200)

        except Music.DoesNotExist:
            return JsonResponse({
                'message': "Music not found.",
                'access_token': access_token,
                'refresh_token': refresh_token
            }, safe=False, status=404)
        except MusicList.DoesNotExist:
            return JsonResponse({
                'message': "MusicList not found.",
                'access_token': access_token,
                'refresh_token': refresh_token
            }, safe=False, status=404)
        except:
            return JsonResponse({
                'message': "Failed to Delete.",
                'access_token': access_token,
                'refresh_token': refresh_token
            }, safe=False, status=500)


@csrf_exempt
def SaveFile(request):
    # Generate tokens
    refresh = RefreshToken.for_user(request.user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)
    if request.method == 'PATCH':
        musiclistData = JSONParser().parse(request)
        musicListId = musiclistData.get("MusicListID")
        picType = musiclistData.get("fileType")
        fileName = str(musicListId) + MIME_TO_EXTENSION[picType]
        blobName = "MusicList Pic/" + fileName
        try:
            musiclist = MusicList.objects.get(musicListId = musicListId)
            musiclist.musicListProfilePic = fileName
            blobUrl = generate_upload_signed_url(BUCKET_NAME,blobName,picType)
            musiclist.save()

            return JsonResponse({
                'message': "MusicList Picture Updated Successfully!!",
                'uploadUrl': blobUrl,
                'access_token': access_token,
                'refresh_token': refresh_token
            }, safe=False, status=200)

        except MusicList.DoesNotExist:
            return JsonResponse({
                'message': "MusicList not found.",
                'access_token': access_token,
                'refresh_token': refresh_token
            }, safe=False, status=404)
        except:
            return JsonResponse({
                'message': "Failed to Update MusicList Picture.",
                'access_token': access_token,
                'refresh_token': refresh_token
            }, safe=False, status=500)


