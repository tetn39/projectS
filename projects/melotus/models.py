from django.db import models



class music_status(models.Model):
    music_id = models.CharField(max_length=22, help_text='曲名', primary_key=True)
    acousticness = models.IntegerField(default=0)
    danceability = models.IntegerField(default=0)
    energy = models.IntegerField(default=0)
    instrumentalness = models.IntegerField(default=0)
    liveness = models.IntegerField(default=0)
    loudness = models.IntegerField(default=0)
    mode = models.IntegerField(default=0)
    speechiness = models.IntegerField(default=0)
    tempo = models.IntegerField(default=0)
    valence = models.IntegerField(default=0)
    country = models.CharField(max_length=2)
    