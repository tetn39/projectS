from django.conf.urls import include
from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.index, name='index'),
    path('songs/', views.songs, name='songs'),
    path('status/', views.status, name='status'),
    path('playlist/', views.playlist, name='playlist'),
    path('jikken/', views.jikken, name='jikken'),
    path('js_py/', views.js_py, name='js_py'),
    path('js_py_playlist/', views.js_py_playlist, name='js_py_playlist'),
    path('get_token/', views.get_token, name='get_token'),
    path('help/', views.help, name='help'),
    path('search/', views.search, name='search'),
    path('add_db/', views.add_db, name='add_db'),
    path('logout/', views.logout_view, name='logout'),
    path('login/', views.login, name='login'),
    path('social/', include('social_django.urls')),
    path('', include('django.contrib.auth.urls')),
    path('test/', views.test, name='test'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)