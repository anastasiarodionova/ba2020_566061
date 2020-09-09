
from django.contrib import admin
from django.urls import path, include
from django.shortcuts import  redirect
from django.contrib.auth import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/login/', views.LoginView.as_view(), name='login'),
    path('websites/', include('websites.urls')),
    path('', lambda req: redirect('/websites/')),
]
