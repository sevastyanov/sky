Ext.define('sky.module.standart.static.action.image.StaticImageAction', {
    extend: 'sky.module.standart.static.action.image.StaticImageAction_ui',

    getData: function() {
        return this.queryById('link').getValue();
    },

    setData: function(data) {
        var link = data || '';
        this.queryById('link').setValue(link);
        this.queryById('img').setSrc(link);
    },

    onClickButton: function() {
        Ext.create('sky.core.widget.file.FileManagerWindow', {
            listeners: {
                select_file: this.onFileSelected,
                scope: this
            }
        });
    },

    onFileSelected: function(file) {
        this.setData(file.get('url'));
    }

});