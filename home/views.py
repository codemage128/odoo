from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views.generic import TemplateView


# Create your views here.
def index(request):
    return redirect('index')


class IndexView(TemplateView):
    template_name = "index.html"


class ReportView(TemplateView):
    template_name = 'reports.html'


class EditorView(TemplateView):
    template_name = 'edit.html'
