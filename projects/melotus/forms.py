from django import forms
from .models import Post

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ('name', 'content',)


# class SongForm(forms.Form):
#     song_name = forms.CharField()