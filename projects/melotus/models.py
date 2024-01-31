from django.db import models



class music_status(models.Model):
    music_id = models.CharField(max_length=22, help_text='曲名', primary_key=True)
    acousticness = models.FloatField(default=0)
    danceability = models.FloatField(default=0)
    energy = models.FloatField(default=0)
    instrumentalness = models.FloatField(default=0)
    liveness = models.FloatField(default=0)
    loudness = models.FloatField(default=0)
    mode = models.FloatField(default=0)
    speechiness = models.FloatField(default=0)
    tempo = models.FloatField(default=0)
    valence = models.FloatField(default=0)
    country = models.CharField(max_length=2)


class history(models.Model):
    history_id = models.AutoField(primary_key=True)
    acousticness = models.FloatField(default=0)
    danceability = models.FloatField(default=0)
    energy = models.FloatField(default=0)
    instrumentalness = models.FloatField(default=0)
    liveness = models.FloatField(default=0)
    loudness = models.FloatField(default=0)
    mode = models.FloatField(default=0)
    speechiness = models.FloatField(default=0)
    tempo = models.FloatField(default=0)
    valence = models.FloatField(default=0)

class melotus_data(models.Model):
    melotus_id = models.AutoField(primary_key=True)
    history_id = models.ForeignKey(history, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

