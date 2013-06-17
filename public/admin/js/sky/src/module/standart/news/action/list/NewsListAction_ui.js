Ext.define('sky.module.standart.news.action.list.NewsListAction_ui', {
    extend: 'sky.core.BaseActionEditor',

    width: '80%',
    height: '80%',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    initComponent: function() {
        this.callParent(arguments);

        this.add([
            Ext.create('sky.core.widget.field.PageTreeSelect', {
                itemId: 'page',
                flex: 1
            })
        ]);
    }
});