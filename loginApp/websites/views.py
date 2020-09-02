from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from .models import Website, WebsiteForm
from django.template import loader
from django import forms
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout as django_logout

import base64
# Create your views here.
@login_required
def index(request):
    websites = Website.objects.order_by('id')
    template = loader.get_template('index.html')
    context = {
        'websites': websites,
    }
    return HttpResponse(template.render(context, request)) #pass all the websites to index.html page


#this will be called to show the website create form
@login_required
def create(request):
    template = loader.get_template('create.html')

    context = {
    }
    return HttpResponse(template.render(context, request))

# Store the form data and then Redirects to Listing Page
@login_required
def store(request):
    f = WebsiteForm(request.POST)
    new_website = f.save();
    new_website.password = encrypt(new_website.password)
    new_website.save()
    return redirect(reverse('index'))


#this will be called to show the edit website form
@login_required
def edit(request, website_id):
    #get website object 
    website = get_object_or_404(Website, pk=website_id)
    template = loader.get_template('edit.html')
    context = {
        'website' : website
    }
    #load the website data in edit page view
    return HttpResponse(template.render(context, request))


#Update an existing Website
@login_required
def update(request, website_id):
    #get website object 
    website = get_object_or_404(Website, pk=website_id)
    f = WebsiteForm(request.POST, instance=website) #Get the Website Object using the ID from url
    f.save() #Save Form
    website.password = encrypt(website.password)
  #  website.password = decrypt(website.password)
    website.save()
    return redirect(reverse('index')) #redirects to Listing Page


#Delete Website
@login_required
def delete(request, website_id):
    #get website object 
    website = get_object_or_404(Website, pk=website_id)
    website.delete()
    return redirect(reverse('index')) #redirects to Listing Page


def encrypt(txt):
    message_bytes = txt.encode('ascii')
    base64_bytes = base64.b64encode(message_bytes)
    return base64_bytes.decode('ascii')

def logout(request):
    django_logout(request)
    return redirect(reverse('login')) 