from io import BytesIO
from django.http import HttpResponse
from django.template.loader import get_template
from xhtml2pdf import pisa
from home.models import Data, Template
import json
from django.forms.models import model_to_dict
from django.core import serializers


def listToString(s):
    # initialize an empty string
    str1 = ","

    # return string
    return (str1.join(s))


def render_to_pdf(template_src, context_dict={}):
    template = get_template(template_src)
    formTemplate = context_dict['form_template']
    headerList = context_dict['headerlist']
    conditionStr = listToString(headerList)
    fileName = formTemplate.category + formTemplate.name
    data = {}
    if conditionStr is "":
        data = {}
        # data = Data.objects.raw("select id from home_data")
    else:
        data = Data.objects.raw("select id," + conditionStr + " from home_data")
    # data = Data.objects.all()
    dict_obj = serializers.serialize('json', data)
    dict_obj = json.loads(dict_obj)
    returnData = []
    for i in dict_obj:
        field = []
        for j in headerList:
            field.append(i['fields'][j])
        returnData.append(field)
    resData = {
        "filename": fileName,
        "data": returnData,
        "headerList": headerList
    }
    html = template.render(resData)
    result = BytesIO()
    pdf = pisa.pisaDocument(BytesIO(html.encode("ISO-8859-1")), result)

    if not pdf.err:
        return HttpResponse(result.getvalue(), content_type='application/pdf')
    return None
