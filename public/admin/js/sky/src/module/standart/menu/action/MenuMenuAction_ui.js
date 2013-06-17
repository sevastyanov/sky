Ext.define('sky.module.standart.menu.action.MenuMenuAction_ui', {
    extend: 'sky.core.BaseActionEditor',

    width: 200,

    initComponent: function() {
        this.callParent(arguments);

        this.add([
            {
                xtype: 'combobox',
                itemId: 'menu',
                fieldLabel: 'Выберите меню',
                store: Ext.create('Ext.data.Store', {
                    fields: ['id', 'name'],
                    autoLoad: true,
                    proxy: {
                        type: 'ajax',
                        url: Sky.baseUrl + '/api',
                        extraParams: {
                            api_module: 'menu',
                            api_action: 'List'
                        },
                        reader: {
                            type: 'json',
                            root: 'result'
                        }
                    }
                }),
                queryMode: 'local',
                displayField: 'name',
                valueField: 'id',
                editable: false
            },
            {
                xtype: 'combobox',
                itemId: 'type',
                fieldLabel: 'Выберите тип',
                store: Ext.create('Ext.data.Store', {
                    fields: ['id', 'name'],
                    data: [
                        {
                            id: 'horizontal',
                            name: Sky._('Горизонтальное')
                        },
                        {
                            id: 'vertical',
                            name: Sky._('Вертикальное')
                        },
                    ]
                }),
                queryMode: 'local',
                displayField: 'name',
                valueField: 'id',
                value: 'horizontal',
                editable: false
            }
        ]);
    }
});