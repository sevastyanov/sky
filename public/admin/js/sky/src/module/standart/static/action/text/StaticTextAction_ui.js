Ext.define('sky.module.standart.static.action.text.StaticTextAction_ui', {
    extend: 'sky.core.BaseActionEditor',

    width: '80%',
    height: '80%',

    initComponent: function() {
        this.callParent(arguments);

        this.add([
            Ext.create('sky.core.widget.TinyMCE', {
                itemId: 'text',
                flex: 1
            })
        ]);
    }
});