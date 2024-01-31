from django.contrib import admin

from .models import music_status, history, melotus_data

admin.site.register(music_status)
admin.site.register(history)
admin.site.register(melotus_data)