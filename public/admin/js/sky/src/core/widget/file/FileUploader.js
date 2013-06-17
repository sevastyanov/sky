Ext.define('sky.core.widget.file.FileUploader', {

    extend: 'Ext.Button',

    renderIframe: function() {

        if (this.elIframe) {
            this.el.dom.removeChild(this.elIframe);
        }

        var el = this.el.dom,
            iframe = document.createElement('iframe');

        el.style.position = 'relative';

        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.style.border = 'none';
        iframe.style.position = 'absolute';
        iframe.style.left = '-10px';
        iframe.style.top = '-10px';

        el.appendChild(iframe);

        var w = iframe.contentWindow,
            d = w.document,
            form = d.createElement('form'),
            input = d.createElement('input'),
            submit = d.createElement('input');

        form.action = location.protocol + '//' + location.host + Sky.baseUrl + '/api?api_module=upload&api_action=Upload';
        form.method = 'post';
        form.enctype = 'multipart/form-data';

        input.type = 'file';
        input.name = 'uploaded_files[]';
        input.multiple = true;

        var inputEl = new Ext.dom.Element(input);
        inputEl.on('change', this.onFilesSelected, this);

        submit.type = 'button';

        form.appendChild(input);
        form.appendChild(submit);

        d.body.appendChild(form);

        this.elIframe = iframe;
        this.elForm = form;
        this.elInput = input;

    },

    afterRender: function() {

        this.renderIframe();

        this.callParent(arguments);
    },

    onClick: function(e) {
        this.callParent(arguments);

        this.elInput.click();
    },

    onFilesSelected: function() {
        var iframeEl = new Ext.dom.Element(this.elIframe);
        iframeEl.on('load', this.onFilesUploaded, this);
        this.disable();
        this.elForm.submit();
    },

    onFilesUploaded: function(e) {

        var me = this;

        // без таймаута валится ошибка
        setTimeout(function() {

            var w = me.elIframe.contentWindow;

            if (w.getUploadResult) {

                var result = w.getUploadResult();

                if (result.errors && result.errors.length) {
                    alert('Произошла ошибка при загрузке файлов');
                }
            }

            me.renderIframe();

        }, 0);

        this.fireEvent('upload');
        this.enable();

    }

});