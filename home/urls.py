from django.urls import path
from django.contrib.auth import views as auth_views
from . import views
from .views import  ReportView, EditorView, GeneratePdf, Preview, upload, save

urlpatterns = [
    path('', views.index),
    path('report/', ReportView.as_view(), name="report"),
    path('edit/', EditorView.as_view(), name="edit"),
    path('save/', save, name="save"),
    path('preview/', GeneratePdf.as_view(), name='preview'),
    # path('view/', GeneratePdf, name="view"),
    # path('download/', GeneratePdf, name="download"),
    path('upload/', upload, name="upload")
]
