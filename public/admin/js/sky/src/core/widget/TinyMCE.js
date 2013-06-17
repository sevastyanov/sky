Ext.define('sky.core.widget.TinyMCE', {

    extend: 'Ext.ux.form.TinyMCETextArea',

    fieldStyle: 'font-family: Courier New; font-size: 12px;',

    noWysiwyg: false,
    value: '',

    constructor: function() {

        this.tinyMCEConfig = {
            // General options
            theme : "advanced",
            plugins : "autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,wordcount,advlist",

            skin: "extjs",
            inlinepopups_skin: "extjs",

            // Original value is 23, hard coded.
            // with 23 the editor calculates the height wrong.
            // With these settings, you can do the fine tuning of the height
            // by the initialization.
            theme_advanced_row_height: 27,
            delta_height: 1,

            // Theme options
            theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
            theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
            theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
            theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak,restoredraft",
            theme_advanced_toolbar_location : "top",
            theme_advanced_toolbar_align : "left",
            theme_advanced_statusbar_location : "bottom",

            // Example content CSS (should be your site CSS)
            //content_css : "contents.css",

            file_browser_callback : Ext.bind(this.onClick_openDialogButton, this)
        };

        this.callParent(arguments);
    },

    onClick_openDialogButton: function(field_name, url, type, win) {

        Ext.create('sky.core.widget.file.FileManagerWindow', {
            listeners: {
                select_file: Ext.bind(this.onFileSelected, this, [field_name, url, type, win], true)
            }
        });
    },

    onFileSelected: function(file, eventCfg, field_name, url, type, win) {
        win.document.forms[0].elements[field_name].value = file.get('url');
    },

    getValue: function() {
        //debugger
        return this.callParent(arguments);
    }

});