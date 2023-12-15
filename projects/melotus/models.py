from django.db import models

class Post(models.Model):
    name = models.CharField(max_length=64, help_text='曲名')
    content = models.TextField(max_length=256, help_text='歌詞')
    