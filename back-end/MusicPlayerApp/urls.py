from django.urls import path, re_path
from MusicPlayerApp import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('musiclist/', views.musiclistApi, name='musiclist-api'),
    re_path(r'^musiclist/(?P<id>[0-9]*)$', views.musiclistApi, name='musiclist-detail-api'),
    path('upload/', views.SaveFile, name='upload-api'),
    path('music/', views.musicApi, name='music-api'),
    re_path(r'^music/(?P<id>[0-9]*)$', views.musicApi, name='music-detail-api'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
