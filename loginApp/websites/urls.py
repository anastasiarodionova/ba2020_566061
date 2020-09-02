from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('create', views.create, name='create'),
    path('store', views.store, name='store'),
    path('edit/<int:website_id>', views.edit, name='edit'),
    path('update/<int:website_id>', views.update, name='update'),
    path('delete/<int:website_id>', views.delete, name='delete'),
    path('logout', views.logout, name='logout'),
]
