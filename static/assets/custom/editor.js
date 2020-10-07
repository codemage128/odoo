// target elements with the "draggable" class

var header_height = 200;
var body_height = 400;
var footer_height = 180;

var textIdList = [];

var focusId = '';

var headerList = [];
var bodyList = [];
var footerList = [];

var x = 0;
var y = 0;

var tableHeaderList = [];
var fontFamily = "";

$('#text-font').fontselect({
    systemFonts: false,
    placeholderSearch: 'Type to search...',
    lookahead: 4
}).on('change', function () {
        var font = this.value;
        font = font.replace(/\+/g, ' ');
        // Split font into family and weight
        font = font.split(':');
        var fontFamily = font[0];
        var fontWeight = font[1] || 400;
        if (focusId != "") {
            $("#" + focusId + ">p").css({fontFamily: "'" + fontFamily + "'", fontWeight: fontWeight});
        }
    });

function changeContentDisplay(type) {
    switch (type) {
        case 1: // text content should be shown
            $('#text').show();
            $('#image').hide();
            $('#table').hide();
            break;
        case 2: // image content should be shown
            $('#text').hide();
            $('#image').show();
            $('#table').hide();
            break;
        case 3: // table content should be shown
            $('#text').hide();
            $('#image').hide();
            $('#table').show();
            break;
    }
}

$('.btn').click(function () {
    // $(document).on('click', '.btn', function () {
    var id = $(this).attr('id');
    // var focus_id = "#" + textFocus;
    switch (id) {
        // Buttons of the top menu bar
        case 'btn-refresh':
            $("div").remove('.content-item');
            break;
        case "btn-text":
            changeContentDisplay(1);
            var d = new Date();
            var _id = d.getTime();
            // textIdList.push(_id);
            var template = "<div class='content-item' data-type='text' id='" + _id + "' style='z-index: 1'><button class='btn btn-xs btn-danger btn-delete'><i class='fa fa-remove'></i></button><p>Text</p></div>";
            $('.content').prepend(template);
            $('.btn-delete').click(function (event) {
                var element = document.getElementById($(this).parent()[0].id);
                element.parentNode.removeChild(element);
            })
            break;
        case "btn-image":
            var d = new Date();
            var _id = d.getTime();
            changeContentDisplay(2);
            var template = '<div class="content-item" data-type="image" id="' + _id + '" style="z-index: 1; background: #d4d4d4; width: 50px; height: 50px;"><button class="btn btn-xs btn-danger btn-delete"><i class="fa fa-remove"></i></button></div>';

            $('.content').prepend(template);

            $('.btn-delete').click(function (event) {
                var element = document.getElementById($(this).parent()[0].id);
                element.parentNode.removeChild(element);
            })
            break;
        case "btn-table":
            $('#table-edit').modal({});
            break;
        case "btn-prev":
            var _html = $('.content').html();
            var templateId = $('#templateId').val();
            console.log(_html);
            $.ajax({
                url: '/saveTemplate/',
                type: "post",
                data: {structure: _html, templateId: templateId},
                success: function (data) {
                    console.log("template is saved!");
                    location.replace('/view?templateId=' + templateId);
                }
            })
            // var _variable = [];
            break;
        case "btn-save":
            var _html = $('.content').html();
            var templateId = $('#templateId').val();
            $.ajax({
                url: '/saveTemplate/',
                type: "post",
                data: {structure: _html, templateId: templateId},
                success: function (data) {
                    $('#save').modal({});
                }
            })
            break;
        case "btn-download":
            break;
        case "text-bold":
            $(this).toggleClass('active');
            if ($(this).hasClass('active')) {
                $("#" + focusId + '>p').css('font-weight', "bold");
            } else {
                $("#" + focusId + '>p').css('font-weight', "100");
            }
            break;
        case "text-italic":
            $(this).toggleClass('active');
            if ($(this).hasClass('active')) {
                $("#" + focusId + '>p').css('font-style', "italic");
            } else {
                $("#" + focusId + '>p').css('font-style', "initial");
            }
            break;
        case "text-underline":
            $(this).toggleClass('active');
            if ($(this).hasClass('active')) {
                $("#" + focusId + '>p').css('text-decoration', "underline");
            } else {
                $("#" + focusId + '>p').css('text-decoration', "initial");
            }
            break;
        case "text-stright":
            $(this).toggleClass('active');
            if ($(this).hasClass('active')) {
                $("#" + focusId + '>p').css('text-decoration', "line-through");
            } else {
                $("#" + focusId + '>p').css('text-decoration', "initial");
            }
            break;
        case "text-align-center":
            $(this).toggleClass('active');
            if ($(this).hasClass('active')) {
                $("#" + focusId + '>p').css('text-align', "center");
            } else {
                $("#" + focusId + '>p').css('text-align', "initial");
            }
            break;
        case "text-align-justify":
            $(this).toggleClass('active');
            if ($(this).hasClass('active')) {
                $("#" + focusId + '>p').css('text-align', "justify");
            } else {
                $("#" + focusId + '>p').css('text-align', "initial");
            }
            break;
        case "text-align-right":
            $(this).toggleClass('active');
            if ($(this).hasClass('active')) {
                $("#" + focusId + '>p').css('text-align', "right");
            } else {
                $("#" + focusId + '>p').css('text-align', "initial");
            }
            break;
        case "text-align-left":
            $(this).toggleClass('active');
            if ($(this).hasClass('active')) {
                $("#" + focusId + '>p').css('text-align', "left");
            } else {
                $("#" + focusId + '>p').css('text-align', "initial");
            }
            break;
        case 'confirm':
            var _tablecontent = $('#table-display').html();
            $('#table-edit').modal('hide');
            changeContentDisplay(3);
            var d = new Date();
            var _id = d.getTime();
            var template = '<div class="content-item" data-type="table" id="' + _id + '">' +
                '<button class=\'btn btn-xs btn-danger btn-delete\'><i class=\'fa fa-remove\'></i></button>' + _tablecontent + '</div>';
            $('.content').prepend(template);
            $('.btn-delete').click(function (event) {
                var element = document.getElementById($(this).parent()[0].id);
                element.parentNode.removeChild(element);
            });
            break;
    }
})

$('input').change(function () {
    var element = $(this).attr('id');
    var _id = "#" + focusId;
    var _value = $(this).val();
    var _pxstring = _value + "px";
    switch (element) {
        case "text-text":
            $(_id + '>p').text($(this).val());
            break;
        case "text-position-x":
            $(_id).attr('data-x', _value);
            var obj = $(_id);
            var transformMatrix = obj.css("-webkit-transform") ||
                obj.css("-moz-transform") ||
                obj.css("-ms-transform") ||
                obj.css("-o-transform") ||
                obj.css("transform");
            var matrix = transformMatrix.replace(/[^0-9\-.,]/g, '').split(',');
            var x = matrix[12] || matrix[4];//translate x
            var y = matrix[13] || matrix[5];//translate y
            $(_id).css('webkitTransform', 'translate(' + _value + 'px, ' + y + 'px');
            $(_id).css('data-x', _value);
            break;
        case "text-position-y":
            $(_id).attr('data-y', _value);
            var obj = $(_id);
            var transformMatrix = obj.css("-webkit-transform") ||
                obj.css("-moz-transform") ||
                obj.css("-ms-transform") ||
                obj.css("-o-transform") ||
                obj.css("transform");
            var matrix = transformMatrix.replace(/[^0-9\-.,]/g, '').split(',');
            var x = matrix[12] || matrix[4];//translate x
            var y = matrix[13] || matrix[5];//translate y
            $(_id).css('webkitTransform', 'translate(' + x + 'px, ' + _value + 'px');
            $(_id).css('data-y', _value);
            break;
        case "text-color":
            $(_id).css('color', _value);
            break;
        case "text-background":
            $(_id).css('background', _value);
            break;
        case "text-padding-left":
            $(_id).css('padding-left', _value + 'px');
            break;
        case "text-padding-top":
            $(_id).css('padding-top', _value + 'px');
            break;
        case "text-padding-bottom":
            $(_id).css('padding-bottom', _value + 'px');
            break;
        case "text-padding-right":
            $(_id).css('padding-right', _value + 'px');
            break;
        case "text-margin-top":
            $(_id).css('margin-top', _value + 'px');
            break;
        case "text-margin-left":
            $(_id).css('margin-left', _value + 'px');
            break;
        case "text-margin-right":
            $(_id).css('margin-right', _value + 'px');
            break;
        case "text-margin-bottom":
            $(_id).css('margin-bottom', _value + 'px');
            break;
        // //image part
        case "image-src":
            var img = this.files[0];
            var reader = new FileReader();
            reader.onloadend = function () {
                $("#" + focusId).css("background", 'url("' + reader.result + '")');
                $("#" + focusId).css("background-repeat", 'no-repeat');
                $("#" + focusId).css("background-size", 'contain');
            }
            reader.readAsDataURL(img);
            break;
        case "image-position-x":
            $(_id).attr('data-x', _value);
            var obj = $(_id);
            var transformMatrix = obj.css("-webkit-transform") ||
                obj.css("-moz-transform") ||
                obj.css("-ms-transform") ||
                obj.css("-o-transform") ||
                obj.css("transform");
            var matrix = transformMatrix.replace(/[^0-9\-.,]/g, '').split(',');
            var x = matrix[12] || matrix[4];//translate x
            var y = matrix[13] || matrix[5];//translate y
            $(_id).css('webkitTransform', 'translate(' + _value + 'px, ' + y + 'px');
            $(_id).css('data-x', _value);
            break;
        case "image-position-y":
            $(_id).attr('data-y', _value);
            var obj = $(_id);
            var transformMatrix = obj.css("-webkit-transform") ||
                obj.css("-moz-transform") ||
                obj.css("-ms-transform") ||
                obj.css("-o-transform") ||
                obj.css("transform");
            var matrix = transformMatrix.replace(/[^0-9\-.,]/g, '').split(',');
            var x = matrix[12] || matrix[4];//translate x
            var y = matrix[13] || matrix[5];//translate y
            $(_id).css('webkitTransform', 'translate(' + x + 'px, ' + _value + 'px');
            $(_id).css('data-y', _value);
            break;
        case "table-position-x":
            $(_id).attr('data-x', _value);
            var obj = $(_id);
            var transformMatrix = obj.css("-webkit-transform") ||
                obj.css("-moz-transform") ||
                obj.css("-ms-transform") ||
                obj.css("-o-transform") ||
                obj.css("transform");
            var matrix = transformMatrix.replace(/[^0-9\-.,]/g, '').split(',');
            var x = matrix[12] || matrix[4];//translate x
            var y = matrix[13] || matrix[5];//translate y
            $(_id).css('webkitTransform', 'translate(' + _value + 'px, ' + y + 'px');
            $(_id).css('data-x', _value);
            break;
        case "table-position-y":
            $(_id).attr('data-y', _value);
            var obj = $(_id);
            var transformMatrix = obj.css("-webkit-transform") ||
                obj.css("-moz-transform") ||
                obj.css("-ms-transform") ||
                obj.css("-o-transform") ||
                obj.css("transform");
            var matrix = transformMatrix.replace(/[^0-9\-.,]/g, '').split(',');
            var x = matrix[12] || matrix[4];//translate x
            var y = matrix[13] || matrix[5];//translate y
            $(_id).css('webkitTransform', 'translate(' + x + 'px, ' + _value + 'px');
            $(_id).css('data-y', _value);
            break;
        case "table-background":
            $(_id + '>table').css('background', _value);
            break;
    }
})
$('select').change(function () {
    var element = $(this).attr('id');
    var _id = "#" + focusId;
    switch (element) {
        case "text-font-size":
            var _value = $(this).val();
            $(_id + '>p').css('font-size', _value);
            break;
    }
})

function reDrawtable(headerList) {
    $('#table-display').empty();
    var template = '<table class="table table-bordered table-striped"><thead><th class="text-center">No</th>';
    headerList.forEach(function (item) {
        template += '<th class="text-center">' + item + '</th>';
    })
    template += '</thead>' +
        '<tbody>' +
        '<tr class="text-center">' +
        '    <td colspan="' + (headerList.length + 1) + '">Database data will be shown in here</td></tr></tbody></table>';
    $('#table-display').append(template);
}

$('#my_multi_select1').on('change', function () {
    var selectedArray = $(this).val();
    tableHeaderList = selectedArray;
    if (selectedArray == null) {
        tableHeaderList = [];
    }
    reDrawtable(tableHeaderList);
})
// heaader , body, footer size resize section.
interact('.resize-drag')
    .resizable({
        //resize from all edges and corners
        edges: {left: false, right: false, bottom: true, top: false},
        listeners: {
            move(event) {
                var target = event.target;
                if (target.classList.contains('content-header') == true) {
                    header_height = event.rect.height;
                }
                if (target.classList.contains('content-body') == true) {
                    body_height = event.rect.height;
                }
                if (target.classList.contains('content-footer') == true) {
                    footer_height = event.rect.height;
                }
                var page_height = header_height + body_height + footer_height;
                var x = (parseFloat(target.getAttribute('data-x')) || 0)
                var y = (parseFloat(target.getAttribute('data-y')) || 0)
                // update the element's style
                // paper_height = event.rect.height;
                if (page_height < 780) {
                    target.style.width = event.rect.width + 'px'
                    target.style.height = event.rect.height + 'px'
                    // translate when resizing from top or left edges
                    x += event.deltaRect.left
                    y += event.deltaRect.top
                    // target.style.webkitTransform = target.style.transform =
                    //     'translate(' + x + 'px,' + y + 'px)'
                    target.setAttribute('data-x', x)
                    target.setAttribute('data-y', y)
                    // text show in here
                    // target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height)
                }
            }
        },
        modifiers: [
            // keep the edges inside the parent
            interact.modifiers.restrictEdges({
                outer: 'parent'
            }),
            // minimum size
            interact.modifiers.restrictSize({
                min: {width: 100, height: 100}
            })
        ],
        inertia: true
    })

function dragMoveListener(event) {
    var target = event.target
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
    // translate the element
    // target.style.webkitTransform =
    //     target.style.transform =
    //         'translate(' + x + 'px, ' + y + 'px)'
    // update the posiion attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
}

function dragResizeListener(event) {
    var target = event.target
    var x = (parseFloat(target.getAttribute('data-x')) || 0)
    var y = (parseFloat(target.getAttribute('data-y')) || 0)

    // update the element's style
    target.style.width = event.rect.width + 'px'
    target.style.height = event.rect.height + 'px'

    // translate when resizing from top or left edges
    x += event.deltaRect.left
    y += event.deltaRect.top
    // target.style.webkitTransform = target.style.transform =
    //     'translate(' + x + 'px,' + y + 'px)'
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
    // target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height)
}

function displayheaderbar() {
    $('#header-list').empty();
    for (var i = 0; i < headerList.length; i++) {
        var element = '#' + headerList[i];
        var template = '<li class="list-group-item">' + $(element).text() + '</li>';
        if ($(element).attr('data-type') == "image") {
            template = '<li class="list-group-item">Image section</li>';
        }
        if ($(element).attr('data-type') == "table") {
            template = '<li class="list-group-item">Table section</li>';
        }
        $('#header-list').append(template);
    }
}
function displaybodybar() {
    $('#body-list').empty();
    for (var i = 0; i < bodyList.length; i++) {
        var element = '#' + bodyList[i];
        var template = '<li class="list-group-item">' + $(element).text() + '</li>';
        if ($(element).attr('data-type') == "image") {
            template = '<li class="list-group-item">Image section</li>';
        }
        if ($(element).attr('data-type') == "table") {
            template = '<li class="list-group-item">Table section</li>';
        }
        $('#body-list').append(template);
    }
}

function displayfooterbar() {
    $('#footer-list').empty();
    for (var i = 0; i < footerList.length; i++) {
        var element = '#' + footerList[i];
        var template = '<li class="list-group-item">' + $(element).text() + '</li>';
        if ($(element).attr('data-type') == "image") {
            template = '<li class="list-group-item">Image section</li>';
        }
        if ($(element).attr('data-type') == "table") {
            template = '<li class="list-group-item">Table section</li>';
        }
        $('#footer-list').append(template);
    }
}

// when the item is dragged into the header, footer, body section.
interact('.content-header')
    .dropzone({
        ondrop: function (event) {
            if (headerList.length == 0) {
                headerList.push(event.relatedTarget.id);
            }
            if (headerList.indexOf(event.relatedTarget.id) == -1) {
                headerList.push(event.relatedTarget.id);
            }
            displayheaderbar();
        }
    })
    .on('dropactivate', function (event) {
        event.target.classList.add('drop-activated')
    })
interact('.content-body')
    .dropzone({
        ondrop: function (event) {
            if (bodyList.length == 0) {
                bodyList.push(event.relatedTarget.id);
            }
            if (bodyList.indexOf(event.relatedTarget.id) == -1) {
                bodyList.push(event.relatedTarget.id);
            }
            displaybodybar();
        }
    })
    .on('dropactivate', function (event) {
        event.target.classList.add('drop-activated')
    })
interact('.content-footer')
    .dropzone({
        ondrop: function (event) {
            if (footerList.length == 0) {
                footerList.push(event.relatedTarget.id);
            }
            if (footerList.indexOf(event.relatedTarget.id) == -1) {
                footerList.push(event.relatedTarget.id);
            }
            displayfooterbar();
        }
    })
    .on('dropactivate', function (event) {
        event.target.classList.add('drop-activated')
    })
// item drag and move, resize section
interact('.content-item')
    .draggable({
        inertia: true,
        modifiers: [
            interact.modifiers.snap({
                targets: [
                    interact.createSnapGrid({x: 10, y: 10})
                ],
                range: Infinity,
                relativePoints: [{x: 0, y: 0}]
            }),
            interact.modifiers.restrict({
                restriction: '.content',
                elementRect: {top: 0, left: 0, bottom: 1, right: 1},
                endOnly: true
            })
        ],
        restrict: {
            restriction: '.content',
            endOnly: true,
            elementRect: {top: 0, left: 0, bottom: 1, right: 1}
        },
        onstart: function (event) {
            focusId = event.target.id;
            $('#' + event.target.id + ">button").css('opacity', '1');
            var seleted_type = $('#' + focusId).attr('data-type');
            var _text = $("#" + focusId + '>p').text();
            switch (seleted_type) {
                case "text":
                    changeContentDisplay(1);
                    $('#text-text').val(_text);
                    break;
            }
        },
        onmove: function (event) {
            var target = event.target;
            var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            target.style.webkitTransform =
                target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        },
        onend: function (event) {
            focusId = event.target.id;
            var target = event.target;
            var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            $('#' + focusId + ">button").css('opacity', '0.5');
            var seleted_type = $('#' + focusId).attr('data-type');
            switch (seleted_type) {
                case "text":
                    changeContentDisplay(1);
                    $('#text-position-x').val(x);
                    $('#text-position-y').val(y);
                    break;
                case "image":
                    changeContentDisplay(2);
                    $('#image-position-x').val(x);
                    $('#image-position-y').val(y);
                    break;
                case 'table':
                    changeContentDisplay(3);
                    $('#table-position-x').val(x);
                    $('#table-position-y').val(y);
                    break;
            }
        }
    })
    .on('dragmove', function (event) {
        x += event.dx;
        y += event.dy;
    })
    .resizable({
        // resize from all edges and corners
        edges: {left: false, right: true, bottom: true, top: false},
        listeners: {
            move(event) {
                var target = event.target
                var x = (parseFloat(target.getAttribute('data-x')) || 0)
                var y = (parseFloat(target.getAttribute('data-y')) || 0)
                // update the element's style
                target.style.width = event.rect.width + 'px'
                target.style.height = event.rect.height + 'px'
                // translate when resizing from top or left edges
                x += event.deltaRect.left
                y += event.deltaRect.top
                // target.style.webkitTransform = target.style.transform =
                //     'translate(' + x + 'px,' + y + 'px)'
                target.setAttribute('data-x', x)
                target.setAttribute('data-y', y)
            }
        },
        modifiers: [
            // keep the edges inside the parent
            interact.modifiers.restrictEdges({
                outer: 'parent'
            }),
            // minimum size
            interact.modifiers.restrictSize({
                min: {width: 50, height: 30}
            })
        ],
        inertia: true
    })

$('.param-item').click(function () {
    // alert($(this).text());
})
// interact('.param-item').draggable({
//     inertia: true,
//     onstart: function (event) {
//         console.log("perfect song");
//     },
// })


// window.dragMoveListener = dragMoveListener
