from .serializers import UserRoleSerializer
from django.views.decorators.csrf import csrf_exempt
from MusicPlayerApp.models import UserRole
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from django.db import IntegrityError
from rest_framework_simplejwt.tokens import RefreshToken

@csrf_exempt
def manageAPI(request, name=0):
    # Generate tokens
    refresh = RefreshToken.for_user(request.user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

    if request.method == 'GET':
        userRoles = UserRole.objects.all()
        userRoles_serializer = UserRoleSerializer(userRoles, many=True)
        return JsonResponse({
            'data': userRoles_serializer.data,
            'access_token': access_token,
            'refresh_token': refresh_token
        }, safe=False)
    elif request.method == 'POST':
        user_data = JSONParser().parse(request)
        if UserRole.objects.filter(username=user_data['username']).exists():
            return JsonResponse({
                'message': "Username already exists.",
                'access_token': access_token,
                'refresh_token': refresh_token
            }, safe=False, status=400)

        userRoles_serializer = UserRoleSerializer(data=user_data)
        if userRoles_serializer.is_valid():
            userRoles_serializer.save()
            
            return JsonResponse({
                'message': "Added Successfully!!",
                'access_token': access_token,
                'refresh_token': refresh_token
            }, safe=False, status=201)
        return JsonResponse({
            'message': "Failed to Add.",
            'access_token': access_token,
            'refresh_token': refresh_token
        }, safe=False, status=400)


    elif request.method == 'PUT':
        user_data = JSONParser().parse(request)
        try:
            userRole = UserRole.objects.get(username=user_data["oldName"])
        except UserRole.DoesNotExist:
            return JsonResponse({
                'message': "Old username does not exist.",
                'access_token': access_token,
                'refresh_token': refresh_token
            }, safe=False, status=400)
        if user_data["newName"] != user_data["oldName"] and UserRole.objects.filter(username=user_data["newName"]).exists():
            return JsonResponse({
                'message': "New username already exists.",
                'access_token': access_token,
                'refresh_token': refresh_token
            }, safe=False, status=400)
        user_role_data = userRole.role
        userRole.delete()
        new_userRole = UserRole(username=user_data["newName"], role=user_role_data)
        new_userRole.save()
        return JsonResponse({
            'message': "Updated Successfully!!",
            'access_token': access_token,
            'refresh_token': refresh_token
        }, safe=False, status=201)

    elif request.method == 'DELETE':
        try:
            userRole = UserRole.objects.get(username=name)
            userRole.delete()
            return JsonResponse({
                'message': "Deleted Successfully!!",
                'access_token': access_token,
                'refresh_token': refresh_token
            }, safe=False, status=201)
        except:
            return JsonResponse({
                'message': "User does not exist.",
                'access_token': access_token,
                'refresh_token': refresh_token
            }, safe=False, status=400)


@csrf_exempt
def loginAPI(request, name=0):
    if request.method == 'POST':
        user_data = JSONParser().parse(request)
        
        # Check if the username exists
        if UserRole.objects.filter(username=user_data['username']).exists():
            user = UserRole.objects.get(username=user_data['username'])
            
            # Check if the role matches
            if user.role == user_data.get('role', None):
                # Generate tokens
                refresh = RefreshToken.for_user(request.user)
                access_token = str(refresh.access_token)
                refresh_token = str(refresh)

                return JsonResponse({
                    'message': user_data['username'],
                    'access_token': access_token,
                    'refresh_token': refresh_token
                }, safe=False, status=201)
            else:
                return JsonResponse({
                    'message': "Username and role do not match.",
                    'access_token': None,
                    'refresh_token': None
                }, safe=False, status=403)
        else:
            return JsonResponse({
                'message': "User does not exist.",
                'access_token': None,
                'refresh_token': None
            }, safe=False, status=400)
    else:
        return JsonResponse({
            'message': "Bad request type",
            'access_token': None,
            'refresh_token': None
        }, safe=False, status=400)