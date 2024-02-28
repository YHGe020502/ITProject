from rest_framework import serializers
from MusicPlayerApp.models import MusicList, Music

class MusicListSerializer(serializers.ModelSerializer):
    class Meta:
        model = MusicList
        fields = '__all__'
        
class MusicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Music
        fields = '__all__'
