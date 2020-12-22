from django.shortcuts import render, redirect
from django.http import HttpResponse, FileResponse
from django.views.generic import TemplateView
from django.views import View
from home.models import Template, User, Address, Data
from django.views.decorators.csrf import csrf_exempt
from reportlab.pdfgen import canvas
import io
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
import json
from home.utils import render_to_pdf, convert_html_to_pdf, change_to_string_from_structure
from datetime import datetime
from django.template.loader import get_template
from django.core.files.storage import FileSystemStorage
from django.http import JsonResponse
import random
import string
import pdfkit

#windows
# config = pdfkit.configuration(wkhtmltopdf='C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe')

# Create your views here.
def index(request):
    return redirect('report')


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

    def get_random_string(self, length):
        letters = string.ascii_lowercase
        result_str = ''.join(random.choice(letters) for i in range(length))
        return result_str

    def get(self, request):
        self.loadData()
        # for i in range(100):
        #     first_name = self.get_random_string(4)
        #     middle_name = self.get_random_string(4)
        #     last_name = self.get_random_string(4)
        #     title = self.get_random_string(4)
        #     gender = self.get_random_string(4)
        #     company_name = self.get_random_string(4)
        #     email = self.get_random_string(4) + "@gmail.com"
        #     phone_number = self.get_random_string(4)
        #     skype = self.get_random_string(4)
        #     contact_type = self.get_random_string(4)
        #     birthday = self.get_random_string(4)
        #     birthday_location = self.get_random_string(4)
        #     blood_group = self.get_random_string(4)
        #     material_status = self.get_random_string(4)
        #     user_id = self.get_random_string(4)
        #     latitude = self.get_random_string(4)
        #     longtitude = self.get_random_string(4)
        #     contact_id = self.get_random_string(4)
        #     provider_type = self.get_random_string(4)
        #     user_role = self.get_random_string(4)
        #     opt = self.get_random_string(4)
        #     support_need = self.get_random_string(4)
        #
        #     Data.objects.create(first_name=first_name, middle_name=middle_name, last_name=last_name, title=title, gender=gender,company_name=company_name, email=email, phone_number=phone_number, skype=skype, contact_type=contact_type, birthday=birthday, birthday_location=birthday_location, blood_group=blood_group, material_status=material_status, user_id=user_id, latitude=latitude, longtitude=longtitude, contact_id=contact_id, provider_type=provider_type, user_role=user_role, opt=opt, support_need=support_need)
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
        returnData = ""
        try:
            template = Template.objects.get(pk=templateId)
            structure = template.structure
            headerList = [
                {
                    "title": "name",
                    "value": "Metronic Version",
                },
                {
                    "title": "email",
                    "value": "admin@admin.com",
                },
                {
                    "title": "phone",
                    "value": "123456789",
                }
            ]
            returnData = {"style": template.category, "name": template.name, "templateId": templateId,
                          "structure": structure, "headerList": headerList}
        except:
            returnData = None
        return render(request, self.template_name, returnData)

    def post(self, request, *args, **kwargs):
        return render(request, self.template_name)


class Preview(View):
    template_name = "view.html"

    def get(self, request):
        templateId = request.GET.get('templateId')
        template = Template.objects.get(pk=templateId)
        structure = template.structure
        user = User.objects.get(pk=1)
        addressList = Address.objects.all()
        returnData = {"style": template.category, "name": template.name, "templateId": templateId,
                      "structure": structure, "username": user.name, 'useremail': user.email,
                      'useraddress': user.address, 'userphone': user.phone, "addressList": addressList}
        return render(request, self.template_name, returnData)

    def post(self, request, *args, **kwargs):
        return render(request, self.template_name)


@csrf_exempt
def upload(request):
    if request.method == "POST" and request.is_ajax() and request.FILES['file']:
        file_val = request.FILES['file']
        fs = FileSystemStorage()
        filename = fs.save(file_val.name, file_val)
        uploaded_file_url = fs.url(filename)
        return JsonResponse({"url": uploaded_file_url})

class GeneratePdf(View):
    # if request.method == "POST" and request.is_ajax():
    # templateId = request.POST.get('templateId')
    # content = request.POST.get('structure')
    # template = Template.objects.get(pk=templateId)
    # template.structure = content
    # template.save()
    # headerlist = request.POST.get('list')
    # headerlist = headerlist.split(",")
    def get(self, request, *args, **kwargs):
        templateId = request.GET.get("templateId")
        template = Template.objects.get(pk=templateId)
        structure = template.structure
        structure_json = json.loads(structure)
        string = change_to_string_from_structure(structure_json)
        options = {'page-size': 'B5', 'dpi': 400}
        #windows
        # pdf = pdfkit.from_string(string, False, configuration=config, options=options)
        #linux
        pdf = pdfkit.from_string(string, False, options=options)
        response = HttpResponse(pdf, content_type='application/pdf')
        # response['Content-Disposition'] = 'attachment; filename="ourcodeworld.pdf"'
        return response
        # data = {}
        # for item in structure_json:
        #     print(item)
        #     if item['title'] == "Header":
        #         data['headerHeight'] = item['size']['height'] + "px"
        # data = {
        #     'pageSize': 'B5',
        #     'data': structure_json,
        # }
        # print(structure_json)
        # pdf = render_to_pdf('pdf/sample.html', data)
        # return HttpResponse(pdf, content_type='application/pdf')


@csrf_exempt
def save(request):
    if request.method == "POST" and request.is_ajax():
        templateId = request.POST.get('templateId')
        data = request.POST.get('data')
        template = Template.objects.get(pk=templateId)
        template.structure = data
        template.save()
        returnData = {"message": "success"}
        return JsonResponse(returnData)
