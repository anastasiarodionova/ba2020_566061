from django.shortcuts import render
from .forms import PostForm
from django.shortcuts import redirect

def post_list(request):
    return render(request, 'password_manager/post_list.html', {})

def post_new(request):
    form = PostForm()
    return render(request, 'blog/post_edit.html', {'form': form})
if request.method == "POST":
    [...]
else:
    form = PostForm()
    form = PostForm(request.POST)

    if form.is_valid():
        post = form.save(commit=False)
        post.author = request.user
        post.published_date = timezone.now()
        post.save()

