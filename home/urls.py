from django.urls import path
from django.contrib.auth import views as auth_views
from . import views
from .views import IndexView, ReportView, EditorView, saveTemplate, Preview, GeneratePdf

urlpatterns = [
    path('', views.index),
    path('dashboard/', IndexView.as_view(), name="index"),
    path('report/', ReportView.as_view(), name="report"),
    path('edit/', EditorView.as_view(), name="edit"),
    path('saveTemplate/', saveTemplate, name="save"),
    # path('view/', Preview.as_view(), name="view"),
    path('view/', GeneratePdf, name="view"),
    path('download/', GeneratePdf, name="download")

]
