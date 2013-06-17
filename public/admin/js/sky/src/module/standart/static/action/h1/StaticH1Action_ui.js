Ext.define('sky.module.standart.static.action.h1.StaticH1Action_ui', {
    extend: 'sky.core.BaseActionEditor',

    initComponent: function() {
        this.callParent(arguments);

        this.add([
            {
                xtype: 'textfield',
                itemId: 'h1'
            }
        ]);
    }
});