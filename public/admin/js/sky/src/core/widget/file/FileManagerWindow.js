Ext.define('sky.core.widget.file.FileManagerWindow', {

    extend: 'sky.core.widget.file.FileManagerWindow_ui',

    onFileSelect: function(item) {
        this.fireEvent('select_file', item);
        this.close();
    }

});