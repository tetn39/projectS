# Generated by Django 4.2.4 on 2023-12-14 02:44

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='曲名', max_length=64)),
                ('content', models.TextField(help_text='歌詞', max_length=256)),
            ],
        ),
    ]
