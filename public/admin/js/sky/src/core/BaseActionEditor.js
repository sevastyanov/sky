Ext.define('sky.core.BaseActionEditor', {
    extend: 'Ext.window.Window',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    config: {
        module: null,
        minWidth: 400,
        minHeight: 150,
        closeAction: 'hide',
        bodyPadding: 5,
        modal: true
    },

    initComponent: function() {
        this.callParent(arguments);

        this.addDocked({
            xtype: 'container',
            dock: 'bottom',
            ui: 'footer',
            padding: '5 0 5 0',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'component',
                    flex: 1
                },
                {
                    xtype: 'button',
                    text: 'Сохранить',
                    minWidth: 70,
                    margin: '0 3 0 0',
                    listeners: {
                        scope: this,
                        click: this.onSave
                    }
                },
                {
                    xtype: 'button',
                    text: 'Отмена',
                    minWidth: 70,
                    listeners: {
                        scope: this,
                        click: this.onCancel
                    }
                }
            ]
        })
    },

    getData: function() {
        throw 'Вызов абстрактного метода sky.core.BaseActionEditor->getData';
    },

    setData: function(data) {
        throw 'Вызов абстрактного метода sky.core.BaseActionEditor->setData';
    },

    onCancel: function() {
        this.close();
    },

    onSave: function() {
        this.fireEvent('save', this.getData());
        this.close();
    }
})