from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from .models import Music, UserRole, MusicList
from rest_framework.test import APIClient
from django.core.files.uploadedfile import SimpleUploadedFile
class UserAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_role = UserRole.objects.create(username='testuser', role='admin')
        self.login_url = reverse('login-api')
        self.manage_url = reverse('manage-api')
        
    def test_login_api(self):
        # Test with correct username and role
        response = self.client.post(self.login_url, {'username': 'testuser', 'role': 'admin'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Test with incorrect username
        response = self.client.post(self.login_url, {'username': 'wronguser', 'role': 'admin'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Test with incorrect role
        response = self.client.post(self.login_url, {'username': 'testuser', 'role': 'user'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_manage_api_get(self):
        response = self.client.get(self.manage_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_manage_api_post(self):
        # Test with new username
        response = self.client.post(self.manage_url, {'username': 'newuser', 'role': 'user'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Test with existing username
        response = self.client.post(self.manage_url, {'username': 'testuser', 'role': 'admin'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_manage_api_put(self):
        # Test with correct old username and new username
        response = self.client.put(self.manage_url, {'oldName': 'testuser', 'newName': 'updateduser'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Test with incorrect old username
        response = self.client.put(self.manage_url, {'oldName': 'wronguser', 'newName': 'updateduser'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_manage_api_delete(self):
        # Test with existing username
        response = self.client.delete(reverse('manage-detail-api', kwargs={'name': 'testuser'}))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED) 
        
        # Check if the user is deleted successfully before recreating it
        if response.status_code == status.HTTP_204_NO_CONTENT:
            UserRole.objects.create(username='testuser', role='admin')
        
        # Test with non-existing username
        response = self.client.delete(reverse('manage-detail-api', kwargs={'name': 'nonexistentuser'}))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

'waiting for frontend add content header'
'''class MusicAPITestCase(TestCase):
    def setUp(self):
        self.url = reverse('music-api')
        self.music = Musics.objects.create(musicName='Test Music', musicType='Rock')
    
    def test_get_music(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_post_music(self):
        data = {'musicName': 'New Music', 'musicType': 'Pop'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Musics.objects.count(), 2)
    
    def test_put_music(self):
        update_url = reverse('music-detail-api', args=[self.music.musicID])
        data = {'musicName': 'Updated Music', 'musicType': 'Jazz'}
        response = self.client.put(update_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.music.refresh_from_db()
        self.assertEqual(self.music.musicName, 'Updated Music')
    
    def test_delete_music(self):
        delete_url = reverse('music-detail-api', args=[self.music.musicID])
        response = self.client.delete(delete_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Musics.objects.count(), 0)'''


'''class MusicListAPITestCase(TestCase):
    def setUp(self):
        self.url = reverse('musiclist-api')
        self.user_role = UserRole.objects.create(username='testuser', role='user')
        self.music_list = MusicList.objects.create(userBelongTo=self.user_role.username)
    
    def test_get_music_list(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_post_music_list(self):
        data = {'musicListName': 'New List', 'userBelongTo': self.user_role.username}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(MusicList.objects.count(), 2)
    
    def test_put_music_list(self):
        update_url = reverse('musiclist-detail-api', args=[self.music_list.musicListId])
        data = {'musicListName': 'Updated List', 'userBelongTo': self.user_role.username}
        response = self.client.put(update_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.music_list.refresh_from_db()
        self.assertEqual(self.music_list.musicListName, 'Updated List')
    
    def test_delete_music_list(self):
        delete_url = reverse('musiclist-detail-api', args=[self.music_list.musicListId])
        response = self.client.delete(delete_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(MusicList.objects.count(), 0)


class SaveFileAPITestCase(TestCase):
    def setUp(self):
        self.url = reverse('upload-api')
    
    def test_save_file(self):
        file = SimpleUploadedFile("file.txt", b"file_content", content_type="text/plain")
        response = self.client.post(self.url, {'file': file})
        self.assertEqual(response.status_code, status.HTTP_200_OK)'''
