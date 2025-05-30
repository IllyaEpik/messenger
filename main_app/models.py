from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
# Create your models here.
class Tags(models.Model):
    name = models.CharField(max_length=100)
    # posts = models.ManyToManyField(to=User_Post)
class Images(models.Model):
    image = models.ImageField(upload_to="images")
class User_Post(models.Model):
    user  = models.ForeignKey(to=User, on_delete= models.CASCADE)
    name = models.CharField(max_length=255)
    theme = models.CharField(max_length=255,null=True)
    tags  = models.ManyToManyField(to=Tags)
    text = models.TextField()
    link  = models.CharField(max_length=255, null=True)
    images = models.ManyToManyField(to=Images)
    reviewers = models.IntegerField()
    likes = models.IntegerField()
    def clean(self):
        ok = super().clean()
        if self.tags.count()>9: 
            raise ValidationError("Максимальна кількість тегів дорівнює 9")
        return ok
class Album(models.Model):
    image = models.ImageField(upload_to="album")
    name = models.CharField(max_length=255)
    year = models.DateField(blank= True,null=True)
    theme = models.CharField(max_length=255)

class Profile(models.Model):
    icon = models.ImageField(upload_to= "profile/")
    birthday = models.DateField(blank= True,null=True)
    user = models.OneToOneField(to = User, on_delete= models.CASCADE)
    album = models.ForeignKey(to=Album, on_delete= models.CASCADE,null=True)