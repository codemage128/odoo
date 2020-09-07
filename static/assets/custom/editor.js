$(function () {

    var contentType = 1; //1 -> text,  2-> image, 3-> table
    var textIdList = [];
    var imageIdList = [];
    var textFocus = "";
    var imageFocus = "";

    //Display the content when the button on the top bar------
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

    function draggableElement() {
        $('#viewPanel>div').css('width', 'fit-content');
        $('#viewPanel>img').css('width', '50%');

        $('#viewPanel>div, #viewPanel>img, #viewPanel>table').css('cursor', 'move');
        $('#viewPanel>div, #viewPanel>img').css('position', 'absolute');

        $('#viewPanel>div, #viewPanel>table, #viewPanel>img').draggable({
            containment: "parent",
            start: function (event, ui) {
                var startpos = $(this).position();
                switch ($(this).prop("tagName")) {
                    case "DIV":
                        changeContentDisplay(1);
                        break;
                    case "IMG":
                        changeContentDisplay(2);
                        break;
                    case "TABLE":
                        changeContentDisplay(3);
                        break;
                }
            },
            stop: function (event, ui) {
                switch ($(this).prop("tagName")) {
                    case "DIV":
                        $('#text-position-x').val($(this).css('left'));
                        $('#text-position-y').val($(this).css('top'));
                        textFocus = $(this).attr('id');
                        break;
                    case "IMG":
                        $('#image-position-x').val($(this).css('left'));
                        $('#image-position-y').val($(this).css('top'));
                        imageFocus = $(this).attr('id');
                        break;
                    case "TABLE":
                        break;
                }
            }
        });
    }

    //Button click event
    $('.btn').click(function () {
        // $(document).on('click', '.btn', function () {
        var id = $(this).attr('id');
        var focus_id = "#" + textFocus;
        switch (id) {
            // Buttons of the top menu bar
            case "btn-text":
                changeContentDisplay(1);
                var d = new Date();
                var _id = d.getTime();
                textIdList.push(_id);
                var template = "<div id='" + _id + "'>Text</div>";
                $('#viewPanel').append(template);
                draggableElement();
                break;
            case "btn-image":
                var d = new Date();
                var _id = d.getTime();
                imageIdList.push(_id);
                changeContentDisplay(2);
                var template = '<img src="https://www.w3schools.com/images/picture.jpg"\n' +
                    '     alt="MDN logo" id="' + _id + '">';
                $('#viewPanel').append(template);
                draggableElement();
                break;
            case "btn-table":
                changeContentDisplay(3);
                var template = '<table class="table table-bordered">\n' +
                    '    <thead>\n' +
                    '    <th>No</th>\n' +
                    '    <th>Name</th>\n' +
                    '    <th>Email</th>\n' +
                    '    </thead>\n' +
                    '</table>';
                $('#viewPanel').append(template);
                draggableElement();
                break;
            case "btn-prev":
                break;
            case "btn-save":
                break;
            case "btn-download":
                break;
            // buttons of the text content's text style
            case "text-bold":
                $(this).toggleClass('active');
                if ($(this).hasClass('active')) {
                    $(focus_id).css('font-weight', "bold");

                } else {
                    $(focus_id).css('font-weight', "100");
                }
                break;
            case "text-italic":
                $(this).toggleClass('active');
                if ($(this).hasClass('active')) {
                    $(focus_id).css('font-style', "italic");
                } else {
                    $(focus_id).css('font-style', "initial");
                }
                break;
            case "text-underline":
                $(this).toggleClass('active');
                if ($(this).hasClass('active')) {
                    $(focus_id).css('text-decoration', "underline");
                } else {
                    $(focus_id).css('text-decoration', "initial");
                }
                break;
            case "text-stright":
                $(this).toggleClass('active');
                if ($(this).hasClass('active')) {
                    $(focus_id).css('text-decoration', "line-through");
                } else {
                    $(focus_id).css('text-decoration', "initial");
                }
                break;
            // buttons of the text content's alignment
            case "text-align-center":
                break;
            case "text-align-justify":
                break;
            case "text-style-right":
                break;
            case "text-style-left":
                break;
        }
    })
    // change the input's value
    $('input').change(function () {
        var element = $(this).attr('id');
        var _id = "#" + textFocus;
        var _value = $(this).val();
        var _pxstring = _value + "px";
        var _image_id = "#" + imageFocus;
        switch (element) {
            case "text-text":
                $(_id).text($(this).val());
                $('#viewPanel>div').css('width', 'fit-content');
                break;
            case "text-position-x":
                $(_id).css('left', _value);
                break;
            case "text-position-y":
                $(_id).css('top', _value);
                break;
            case "text-color":
                $(_id).css('color', _value);
                break;
            case "text-background":
                $(_id).css('background', _value);
                break;
            case "text-padding-left":
                $(_id).css('padding-left', _pxstring);
                break;
            case "text-padding-top":
                $(_id).css('padding-top', _pxstring);
                break;
            case "text-padding-bottom":
                $(_id).css('padding-bottom', _pxstring);
                break;
            case "text-padding-right":
                $(_id).css('padding-right', _pxstring);
                break;
            case "text-margin-top":
                $(_id).css('margin-top', _pxstring);
                break;
            case "text-margin-left":
                $(_id).css('margin-left', _pxstring);
                break;
            case "text-margin-right":
                $(_id).css('margin-right', _pxstring);
                break;
            case "text-margin-bottom":
                $(_id).css('margin-bottom', _pxstring);
                break;
            case "text-width":
                $(_id).css('width', _pxstring);
                break;
            //image part
            case "image-src":
                // $(_image_id).attr('src', _value);
                var img = this.files[0];
                console.log(img);
                var reader = new FileReader();
                reader.onloadend = function () {
                    $(_image_id).attr("src", reader.result);
                }
                reader.readAsDataURL(img);
                break;
            case "image-position-x":
                $(_image_id).css('left', _value);
                break;
            case "image-position-y":
                $(_image_id).css('top', _value);
                break;
            case "image-width":
                $(_image_id).css('width', _value);
                break;
            case "image-height":
                $(_image_id).css('height', _value);
                break;
             case "image-background":
                $(_image_id).css('background', _value);
                break;
            case "image-padding-left":
                $(_image_id).css('padding-left', _pxstring);
                break;
            case "image-padding-top":
                $(_image_id).css('padding-top', _pxstring);
                break;
            case "image-padding-bottom":
                $(_image_id).css('padding-bottom', _pxstring);
                break;
            case "image-padding-right":
                $(_image_id).css('padding-right', _pxstring);
                break;
            case "image-margin-top":
                $(_image_id).css('margin-top', _pxstring);
                break;
            case "image-margin-left":
                $(_image_id).css('margin-left', _pxstring);
                break;
            case "image-margin-right":
                $(_image_id).css('margin-right', _pxstring);
                break;
            case "image-margin-bottom":
                $(_image_id).css('margin-bottom', _pxstring);
                break;
        }
    })
    $('select').change(function () {
        var element = $(this).attr('id');
        var _id = "#" + textFocus;
        switch (element) {
            case "text-font":
                break;
            case "text-font-size":
                var _value = $(this).val();
                $(_id).css('font-size', _value);
                break;
        }
    })
});
