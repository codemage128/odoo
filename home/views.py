from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views.generic import TemplateView
from django.views import View
from home.models import Template

from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator


# Create your views here.
def index(request):
    return redirect('report')


class IndexView(TemplateView):
    template_name = "index.html"

class ReportView(View):
    template_name = 'reports.html'
    # contact List
    addressList = []
    telList = []
    cityList = []
    occupationList = []

    # task List
    taskCategoryList = []
    taskOwnerList = []

    # staff List
    phoneList = []
    staff_addressList = []
    response = {}

    def __init__(self):
        self.addressList = []
        self.telList = []
        self.cityList = []
        self.occupationList = []
        self.taskCategoryList = []
        self.taskOwnerList = []
        self.phoneList = []
        self.staff_addressList = []

    def loadData(self):
        templateList = Template.objects.all()
        for template in templateList:
            if template.category == "addressList": self.addressList.append(template)
            if template.category == "telList": self.telList.append(template)
            if template.category == "cityList": self.cityList.append(template)
            if template.category == "occupationList": self.occupationList.append(template)
            if template.category == "taskCategoryList": self.taskCategoryList.append(template)
            if template.category == "taskOwnerList": self.taskOwnerList.append(template)
            if template.category == "phoneList": self.phoneList.append(template)
            if template.category == "staff_addressList": self.staff_addressList.append(template)
        self.response = {"addressList": self.addressList, "telList": self.telList, "cityList": self.cityList,
                         "occupationList": self.occupationList, "taskCategoryList": self.taskCategoryList,
                         "taskOwnerList": self.taskOwnerList, "phoneList": self.phoneList,
                         "staff_addressList": self.staff_addressList}

    def get(self, request):
        self.loadData()
        return render(request, self.template_name, {"data": self.response})

    def post(self, request, *args, **kwargs):
        name = request.POST.get('name')
        category = request.POST.get('category')
        message = False
        try:
            Template.objects.create(name=name, category=category)
            self.loadData()
            message = True
        except:
            message = False
        return render(request, self.template_name, {"data": self.response, "message": message})

class EditorView(View):
    template_name = 'edit.html'

    def __init__(self):
        pass

    def get(self, request):
        templateId = request.GET.get('templateId')
        template = Template.objects.get(pk=templateId)
        returnData = {"style": template.category, "name": template.name}
        return render(request, self.template_name, returnData)

    def post(self, request, *args, **kwargs):
        return render(request, self.template_name)
