from django.db import models
from django.forms import ModelForm
import base64

# Create Your Website Model here.

class Website(models.Model):
    @property
    def plain_password(self):
        return decrypt(self.password)

        
    website = models.CharField(max_length=200)
    url = models.CharField(max_length=1000)
    password =models.CharField("Password", max_length=200) 


#this class will help us automatically creating website object from the form
class WebsiteForm(ModelForm):
    class Meta:
        model = Website
        fields = ['url', 'password', 'website']




def decrypt(base64_message):
    base64_bytes = base64_message.encode('ascii')
    message_bytes = base64.b64decode(base64_bytes)
    return  message_bytes.decode('ascii')