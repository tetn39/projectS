from django.contrib import admin

from .models import music_status, history, melotus_data, spotify_data

admin.site.register(music_status)
admin.site.register(history)
class MelotusDataAdmin(admin.ModelAdmin):
    list_display = ['melotus_id', 'spotify_id', 'history_id', 'date']

admin.site.register(melotus_data, MelotusDataAdmin)
admin.site.register(spotify_data)
