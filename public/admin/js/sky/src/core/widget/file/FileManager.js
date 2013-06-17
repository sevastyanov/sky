Ext.define('sky.core.widget.file.FileManager', {
    extend: 'sky.core.widget.file.FileManager_ui',

    extentions: {
        bmp: 1,
        doc: 1,
        docx: 1,
        gif: 1,
        jpg: 1,
        jpeg: 1,
        pdf: 1,
        psd: 1,
        rar: 1,
        txt: 1,
        zip: 1
    },

    initComponent: function() {
        this.callParent(arguments);
        this.loadFileList();
    },

    onLoadFileList_success: function(response) {
        var data = Ext.decode(response.responseText),
            files = data.result;

        this.store.loadData(files);
    },

    onLoadFileList_failure: function() {

    },

    onLoadFileList_callback: function() {

    },

    loadFileList: function() {

        Ext.Ajax.request({
            url: Sky.baseUrl + '/api?api_module=upload&api_action=FileList',
            params: {
                //api_data: Ext.JSON.encode(data)
            },
            success:  this.onLoadFileList_success,
            failure:  this.onLoadFileList_failure,
            callback: this.onLoadFileList_callback,
            scope:    this
        });
    },

    onItemDblClick: function(view, record, item, index, e, eOpts) {
        this.fireEvent('select', record);
    },

    onFilesUpload: function() {
        this.loadFileList();
    }


})