from django.contrib import admin
from django.conf.urls import include
from django.urls import path
from django.contrib.auth import views as auth_views
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.index, name='index'),
    path('songs/', views.songs, name='songs'),
    path('test/', views.test, name='test'),
    path('playlist/', views.playlist, name='playlist'),
    path('social/', include('social_django.urls')),
    path('', include('django.contrib.auth.urls')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# old
# urlpatterns = [
#     path('', views.index, name='index'),
#     path('login/', views.login, name='login'),
#     path('test/', views.test, name='test'),
#     path('playlist/', views.playlist, name='playlist'),
#     path('social/', include('social_django.urls')),
#     path('', include('django.contrib.auth.urls')),
# ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)