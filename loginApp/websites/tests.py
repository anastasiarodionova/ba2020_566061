from django.test import TestCase, Client, RequestFactory
from django.urls import reverse
from django.contrib.auth.models import User
from .models import Website


class MyTestCase(TestCase):
    def setUp(self):
        User.objects.create_user(username='testuser', password='testuserpassword')
        self.client.login(username='testuser', password='testuserpassword')

    def test_create_password(self):

        count_before = Website.objects.all().count()
        newObject =  {"website":"testwebsite", "url": "user", "password" : "password@321"}
        response = self.client.post('/websites/store', newObject)
        count_after = Website.objects.all().count()
        self.assertEqual(count_before, count_after - 1)
