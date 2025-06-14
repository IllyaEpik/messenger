from django.shortcuts import render, redirect
from django.views.generic.base import TemplateView

from django.contrib.auth.views import  LogoutView
from .forms import messageForm,UserSet,ProfileForm,AlbumForm
from .models import *

from django.core.handlers.wsgi import WSGIRequest
import json
from django.contrib.auth.decorators import login_required

from django.views.generic.base import TemplateView
from django.views.generic.edit import FormView
from django.contrib.auth.views import LogoutView
from .forms import messageForm,UserSet,ProfileForm
from .models import User_Post, Profile, Tags, Images, Link
from chat_app.models import ChatGroup
# ChatGroup
# from django.conf import settings
# Create your views here.
# class MainPageView(FormView):
#     template_name = "main_app/main.html"
#     form_class = messageForm
#     success_url = reverse_lazy('main')
#     # def get_form_kwargs(self):
#     #     kwargs = super().get_form_kwargs()
#     #     kwargs['user'] = self.request.user
#     #     return kwargs
#     def get_context_data(self, **kwargs):
#         context = super().get_context_data(**kwargs)
#         # Instantiate forms for GET request (initial display)
#         context['form1'] = messageForm()
#         context['form2'] = UserSet()
#         return context
#     def post(self, request, *args, **kwargs):
#         form1 = messageForm(request.POST, prefix='form1')
#         form2 = UserSet(request.POST, prefix='form2')
#         print('heheeheh')
#         if 'images1' in request.POST:
#             if form1.is_valid():
#                 return self.form_valid(form1)
#             else:
#                 return self.form_invalid(form1)
#         else:
#             print('hello')
#             if form2.is_valid():
#                 return self.form_valid(form2)
#             else:
#                 return self.form_invalid(form2)
#     def form_valid(self, form):
#         print('heelo')
#         if self.request.POST.get('formType') == 'modalForm':
#             form.send(self.request.user,self.request.FILES.getlist("images"),self.request.POST.get('type'),self.request.POST.get('imgs'))
#         else:
#             print(form,self.request.user)
#             form.save(self.request.user)
#         return super().form_valid(form)



class CustomLogoutView(LogoutView):
    next_page = "login"

# def get(request):
#     return render(request, 'main_app/main.html')
def personal(request:WSGIRequest):
    if not request.user.is_authenticated:

        return redirect('login')
    profile_form = ProfileForm(user=request.user)
    
    profile = Profile.objects.get(user_id = request.user.pk)
    print(profile,'profile')
    if request.method == 'POST':
        print('hello')
        user = request.user
        # print
        type = request.POST.get('type')
        if type == 'main_data':
            user.first_name = request.POST.get('first_name')
            user.last_name =request.POST.get('last_name')
            user.email = request.POST.get('email')
            profile.birthday = request.POST.get('date_of_birthday')
            user.save()
            # profile
            # elec
        elif type == 'profile':
            profile.icon = request.FILES.get('profile_icon')
        elif type == 'elec':

            profile.electronicSignature = request.FILES.get('elec')
            print(profile.electronicSignature,8976543213)
        profile.save()
        # if profile_form.is_valid():
        #     profile_form.save(user=request.user)
        # print(profile_form)
    # request.user.password.
    # user = request.user
    return render(request, 'main_app/personal.html',context={
        "form":profile_form,
        'profile':profile

        # 'profile_icon':profile.icon
        # 'first_name':user.first_name,
        # 'last_name':user.last_name,
        # 'email':user.email,
        # 'password':user.password,
    })


def friends(request:WSGIRequest,typek='123'):
    users = User.objects.exclude(pk= request.user.pk)
    user = Profile.objects.get(user = request.user)
    # ,friends=request.user.pk
    requests = []
    friends_users = []
    for request_user in users:
        # 
        if not Profile.objects.filter(user = request_user).exclude(friends=user):
            friends_users.append(request_user)
        else:
            requests.append(request_user)
    if request.method == 'POST':
        post = json.loads(request.body)
        pk = post.get("pk")
        # json
        user_friend = Profile.objects.get(user_id = pk)
        name = f"{request.user.pk} {user_friend.user.pk}"
        chat = ChatGroup.objects.filter(name = name)
        # если немає чатів 
        if  not chat:
            chat_group = ChatGroup.objects.create(name = name)
            print(name)
        user_friend.friends.add(user)
        user_friend.save()
        
    # print(user.friends.all()[0].birthday)
    print(requests,friends_users)
    return render(request, 'main_app/friends.html', context={
        'typek':typek,
        'requests':requests,
        'friends':friends_users
    })
def friends_account(request:WSGIRequest,pk):
    user =User.objects.get(pk = pk)
    return render(request, 'main_app/friends_account.html',context={'pk':pk,'user':user})
def albums(request:WSGIRequest):
# <<<<<<< HEAD
    # profile  = Profile.objects.get(user=request.user)
    if request.method == 'POST':
        form_type = request.POST.get("type")
        if form_type == 'album':
            album = Album.objects.create(
                name = request.POST.get("name"),
                year = request.POST.get("year"),
                theme = request.POST.get("theme"),
                user = request.user
            )
        if form_type == 'images':
            print('tyuyiuopiuytwefsvbgnyujk7iy6trewqergtyu798')
            album = Album.objects.get(pk=int(request.POST.get("pk")))
            img_list = []
            print(request.FILES)
            for img in request.FILES.getlist('images'):
                print('imgmgg')                # img_list.append(Images.objects.create(image=img))
                album.images.add(Images.objects.create(image=img))
            
            album.save()
        # images 
            print(album)
            print(album.images.all())
    user_albums = Album.objects.filter(user=request.user)
    
    return render(request, 'main_app/albums.html', context= {"albums" :user_albums})
# =======
#     return render(request, 'main_app/albums.html')

# @login_required 

# >>>>>>> origin/Renat
