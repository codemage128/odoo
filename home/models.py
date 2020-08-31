from django.db import models

# Create your models here.
class Template(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=300)
    category = models.CharField(max_length=100)