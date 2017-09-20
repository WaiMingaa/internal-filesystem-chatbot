var templateObject = (function () {

    return {
        getTemplate: buildTemplate
    }

    function buildTemplate(json) {
        var type = json.type;
        var content = json.content;
        switch (type) {
            case 'verticalbutton':
                return _buildVerticalButtonGroup(content);
                break;
            case 'verticaliconbutton':
                return _buildVerticalIconButtonGroup(content);
                break;
            case 'yesnobutton':
                return _buildYesNoButton(content);
                break;
            case 'card':
                return _buildCardItem(content);
                break;
            case 'form':
                return _buildForm(content);
                break;
            case 'buttonform':
                return _buildButtonForm(content);
                break;
            case 'feedback':
                return _buildfeedback(content);
                break;
            case 'casenumber':
                return _buildcasenumber(content);
                break;
            case 'doc'
                return _buildDocument(content);
        }
    }

    function _buildButtonForm(content) {
        var str = '<div class="ui large  form">';
        content.question.forEach(function (q) {
            str += "<div style=\" display:inline-block;padding:10px;\" class=\"inline grouped fields\">"
            str += "<label>" + q.title + "</label>"
            q.field.forEach(function (f) {
                if (q.type == "radio") {
                    str += '<div class="field">'
                    str += '<div class="ui radio checkbox">';
                    str += '<input type="radio" >';
                    str += '  <label>' + f.name + '</label>';
                    str += '</div>'
                    str += '</div>'
                } else {
                    str += '<div class="field">'
                    str += '<div class="ui  checkbox">';
                    str += '<input type="checkbox" >';
                    str += '  <label>' + f.name + '</label>';
                    str += '</div>'
                    str += '</div>'

                }
            })
            str += "</div>"
        })
        str += "</div>"
        str += "<div><button onClick=\"sendByButton('表格已經傳送')\" class=\"ui button\">";
        str += "  提交";
        str += "<\/button></div>";
        return '<div class=\"ui segment\" ">' + str + '</div>';
    }

    function _buildCheckBox(content) {
        var str = '<div class="ui checkbox">';
        content.checkboxs.forEach(function (checkbox) {
            str += '<input type="checkbox" >';
            str += '<label>' + checkbox + '</label></input>'
        })
    }

    str += "</div>"

    function _buildForm(content) {
        var title = "'"+content.title+"'";
        var str = '';
        var component = ''
        var listofid = [];
        content.items.forEach(function (item) {
            if (item.type == "select") {
                listofid.push(item.id);
                //str += "          <div id=\""+title+"\" class=\"ui selection dropdown\">";
                str += "          <div class=\"ui selection dropdown\">";
                str += '          <input type=\"hidden\"   id=' + "\"" + item.id + "\"" + '   ng-model=' + "\"" + item.id + "\"" + ' >'
                str += "          <i class=\"dropdown icon\"><\/i>";
                str += "          <div class=\"default text\">" + item.name + "<\/div>"
                str += "          <div class=\"menu\">";
                item.data.forEach(function (i) {
                    str += "<div class=\"item\" data-value=" + "'" + i + "'" + ">" + i + "<\/div>";
                })
                str += "      <\/div>";
                str += "  <\/div>";
            } else if (item.type == "datefromlabeledinput") {
                str += '<span class="ui  input">'
                str += "<input onfocus=\"blur()\" name=\"from\" type=\"text\" id=\"from\" ng-init=\"from\" placeholder=" + "'" + item.placeholder + "'" + ">"
                str += "</span>"
                listofid.push('from');
            } else if (item.type == "datetolabeledinput") {
                str += '<span class="ui  input">'
                str += "<input onfocus=\"blur()\" name=\"to\" type=\"text\" id=\"to\" ng-init=\"to\" placeholder=" + "'" + item.placeholder + "'" + ">"
                str += "</span>"
                listofid.push('to');
            }
        })
        var form_object = listofid;
        form_object.unshift(title);
        str += "<div><button onClick=\"submitform("+form_object+")\" class=\"ui button\">";
        str += "  提交";
        str += "<\/button></div>";
        return '<div class=\"ui fluid segment\" ">' + str + '</div>';
    }

    function _buildCardItem(content) {
        var count = 0;
        var str = '<div class="ui fluid tabular menu">';
        content.items.forEach(function (item) {
            if (count == 0)
                str += '<div class="active item" data-tab="' + item.tab + '">' + item.tab + '</div>'
            else
                str += '<div class="item" data-tab="' + item.tab + '">' + item.tab + '</div>'
            count += 1;
        })
        str += '</div>'
        var component = ''
        count = 0;
        content.items.forEach(function (item) {
            if (count == 0)
                component += '<div class="active ui fluid tab" data-tab="' + item.tab + '">'
            else
                component += '<div class="ui fluid tab" data-tab="' + item.tab + '">'
            component += '<div class="ui fluid card">';
            component += '<img src="' + item.img + '" style="width:210px;height:140px;" class="visible content"><div class="content"><a class="header">' + item.header + '</a><div class="meta"><span>' + item.des + '</span></div></div>'
            component += '</div></div>'
            count += 1;
        })
        str += component;
        return str;
    }

    function _buildVerticalButtonGroup(content) {
        var str = '<div class="ui vertical buttons">';
        var component = '';
        content.buttons.forEach(function (button) {
            component += '<button class="ui button" onClick="sendByButton(' + "'" + button.value + "'" + ')">' + button.name + '</button>';
        })
        str += component;
        str += '</div>';
        return str;
    }

    function _buildYesNoButton(content) {
        var component = ''
        content.buttons.forEach(function (button) {
            component += '<button  onClick="sendByButton(' + "'" + button.value + "'" + ')" class="ui  button">' + button.name + '</button>';
        })
        return component;
    }

    function _buildcasenumber(content) {
        return '<div>以下是你的參考編號: {{casenumber}}</div>'
    }

    function _buildfeedback(content) {
        return '<div class=\"ui large star rating data-rating="3"\"><i class=\"icon\"></i><i class=\"icon\"></i><i class=\"icon\"></i><i class=\"icon\"></i><i class=\"icon\"></i></div>'
    }

    function _buildVerticalIconButtonGroup(content) {
        var str = '<div id="choice"  class="ui vertical buttons" >'
        var component = ''
        content.buttons.forEach(function (button) {
            component += '<button  onClick="sendByButton(' + "'" + button.value + "'" + ')" class="ui mini labeled icon button"><i class="' + button.icon + '"></i>' + button.name + '</button>';
        })
        str += component;
        str += '</div>';
        return str;
    }
    function _buildDocument(content){
        var strVar="<div class=\"ui link items\">"
        strVar +="<a target=\"_self\" href=\""+content.url+"\" >";
        strVar += " <div class=\"item\">";
        strVar += "    <div class=\"ui tiny image\">";
        strVar += "      <img src=\""+content.img+"\">";
        strVar += "    <\/div>";
        strVar += "    <div class=\"content\">";
        strVar += "      <div class=\"header\">"+content.header+"<\/div>";
        strVar += "      <div class=\"description\">";
        strVar += "        <p>"+content.description+"<\/p>";
        strVar += "      <\/div>";
        strVar += "    <\/div>";
        strVar += "  <\/div>";
        strVar +="<\/a><\/div>";
        return strVar;
    }
})();
