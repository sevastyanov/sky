Ext.define('sky.core.widget.file.FileManagerWindow_ui', {

    extend: 'Ext.window.Window',

    autoShow: true,
    modal: true,
    width: '80%',
    height: '80%',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    initComponent: function() {

        this.callParent(arguments);

        this.add([
            Ext.create('sky.core.widget.file.FileManager', {
                flex: 1,
                listeners: {
                    select: this.onFileSelect,
                    scope: this
                }
            })
        ])

    }

});