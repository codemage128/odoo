from io import BytesIO
from django.http import HttpResponse
from django.template.loader import get_template
from xhtml2pdf import pisa
from home.models import Data, Template
import json
from django.forms.models import model_to_dict
from django.core import serializers


def change_to_string_from_structure(data={}):
    returnString = """<p style="position:absolute; background-color: #03A9F4;height: 100px; width: 100%; top: 0px"></p>
   <p style="position:absolute; background-color: #03A9F4;height: 50px; width: 100%; bottom: 0px"></p>
   <img src="https://www.gstatic.com/webp/gallery3/1.sm.png"
         style="position:absolute; width: 150px; top: 150px; left: 50px" />
   <p style="position:absolute; width: 150px; top: 150px; left: 250px; font-size: 20px; color: blue;">Name: Lose</p>
   <hr
      style="position:absolute; width: 200px; top: 200px; left: 250px; border-style: dashed; border-width: 2px; border-color: green;" />
   <p style="position:absolute; width: 150px; top: 250px; left: 250px; font-size: 20px; color: blue;">Category:
      Flower</p>
   <hr style="position:absolute; width: 200px; top: 300px; left: 250px; border-style: dashed; border-width: 2px; border-color: green;" />"""
    headerString = ""
    footerString = ""
    imageString = ""
    textString = ""
    lineString = ""
    tableString = ""

    for item in data:
        if item['title'] == "Header":
            _str = """<p style="position:absolute; background-color: """ + item['style'][
                'backgroundColor'] + """;height: 100px; width: 100%; top: 0px"></p>"""
            if "size" in item:
                _str = _str = """<p style="position:absolute; background-color: """ + item['style'][
                    'backgroundColor'] + """;height: """ + item['size'][
                                  'height'] + """px; width: 100%; top: 0px"></p>"""
            headerString = _str
        if item['title'] == "Footer":
            _str = """<p style="position:absolute; background-color: """ + item['style'][
                'backgroundColor'] + """;height: 100px; width: 100%; bottom: 0px"></p>"""
            if "size" in item:
                _str = _str = """<p style="position:absolute; background-color: """ + item['style'][
                    'backgroundColor'] + """;height: """ + item['size'][
                                  'height'] + """px; width: 100%; bottom: 0px"></p>"""
            footerString = _str
        if item['title'] == "Image":
            _str = """<img src='http://localhost:8000""" + item['url'] + """' style="position:absolute; width: """ + \
                   item['size'][
                       'width'] + """px; height: """ + item['size']['height'] + """px; top: """ + item['position'][
                       'top'] + """px; left: """ + item['position']['left'] + """px" />"""
            imageString += _str
        if item['title'] == "Text":
            variable = ""
            fontSize = "16pt"
            fontColor = "black"
            fontWeight = "100"
            fontStyle = "initial"
            textDecoration = "initial"
            textAlign = "initial"
            if "font-size" in item['style']:
                fontSize = item['style']['font-size']
            if "color" in item['style']:
                fontColor = item['style']['color']
            if "font-weight" in item['style']:
                fontWeight = item['style']['font-weight']
            if "font-style" in item['style']:
                fontStyle = item['style']['font-style']
            if "text-decoration" in item['style']:
                textDecoration = item['style']['text-decoration']
            if "text-align" in item['style']:
                textAlign = item['style']['text-align']
            if "variable" in item:
                variable = item['variable']
            _str = """<p style="position:absolute; width: """ + item['size']['width'] + """px; top: """ + \
                   item['position']['top'] + """px; left: """ + item['position'][
                       'left'] + """px; font-size: """ + fontSize + """; color: """ + fontColor + """; font-weight: """ + fontWeight + """; font-style: """ + fontStyle + """; text-decoration: """ + textDecoration + """; text-align: """ + textAlign + """;">""" + \
                   item['content'] + variable + """</p>"""
            textString += _str
        if item['title'] == "Line":
            print(item)
            borderStyle = "solid"
            borderWidth = "2px"
            borderTopColor = 'black'

            if "border-top-color" in item['style']:
                borderTopColor = item['style']['border-top-color']
            if "border-width" in item['style']:
                borderWidth = str(item['style']['border-width']) + 'px'
            if "border-style" in item['style']:
                borderTopColor = item['style']['border-style']
            _str = """<hr style="position:absolute; width: """ + item['size']['width'] + """px; top: """ + \
                   str(item['position']['top']) + """px; left: """ + str(item['position'][
                       'left']) + """px; border-style: """ + borderStyle + """; border-width: """ + borderWidth + """; border-color: """ + borderTopColor + """;" />"""
            lineString += _str
        if item['title'] == "Table":

            pass
    returnString = headerString + footerString + imageString + textString + lineString + tableString
    print(returnString)
    return returnString


def listToString(s):
    # initialize an empty string
    str1 = ","
    # return string
    return (str1.join(s))


def convert_html_to_pdf(source_html, output_filename):
    # open output file for writing (truncated binary)
    result_file = open(output_filename, "w+b")

    # convert HTML to PDF
    pisa_status = pisa.CreatePDF(
        source_html,  # the HTML to convert
        dest=result_file)  # file handle to recieve result

    # close output file
    result_file.close()  # close output file

    # return False on success and True on errors
    return pisa_status.err


def render_to_pdf(template_src, context_dict={}):
    template = get_template(template_src)
    html = template.render(context_dict)
    result = BytesIO()
    pdf = pisa.pisaDocument(BytesIO(html.encode("ISO-8859-1")), result)
    if not pdf.err:
        return HttpResponse(result.getvalue(), content_type='application/pdf')
    return None
