# Generated by Django 4.2.4 on 2024-01-10 05:23

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='music_status',
            fields=[
                ('music_id', models.CharField(help_text='曲名', max_length=22, primary_key=True, serialize=False)),
                ('acousticness', models.IntegerField(default=0)),
                ('danceability', models.IntegerField(default=0)),
                ('energy', models.IntegerField(default=0)),
                ('instrumentalness', models.IntegerField(default=0)),
                ('liveness', models.IntegerField(default=0)),
                ('loudness', models.IntegerField(default=0)),
                ('mode', models.IntegerField(default=0)),
                ('speechiness', models.IntegerField(default=0)),
                ('tempo', models.IntegerField(default=0)),
                ('valence', models.IntegerField(default=0)),
                ('country', models.CharField(max_length=2)),
            ],
        ),
    ]
