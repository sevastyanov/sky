Ext.define('sky.module.standart.page.main.PageLabelEditor_ui', {

    extend: 'Ext.form.FieldSet',

    title: 'Название метки',

    config: {
        padding: 5,
        margins: '0 0 4 0',
        padding: 5
    },

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    initComponent: function() {

        this.callParent(arguments);

        this.add([
            {
                xtype: 'combo',
                itemId: 'module',
                store: this.moduleStore,
                fieldLabel: Sky._('Модуль'),
                editable: false,
                queryMode: 'local',
                displayField: 'title',
                valueField: 'code',
                flex: 1,
                value: 'inherit',
                labelWidth: 100,
                margins: '0 15 0 0',
                listeners: {
                    change: this.onChangeModule,
                    scope: this
                }
            },
            {
                xtype: 'combo',
                itemId: 'module_action',
                store: Ext.create('Ext.data.Store', {
                    fields: ['code', 'title'],
                    data : []
                }),
                disabled: true,
                fieldLabel: Sky._('Тип контента'),
                editable: false,
                queryMode: 'local',
                displayField: 'title',
                valueField: 'code',
                margins: '0 15 0 0',
                flex: 1,
                labelWidth: 100,
                listeners: {
                    change: this.onChangeAction,
                    scope: this
                }
            },
            {
                xtype: 'button',
                text: Sky._('Настройка'),
                itemId: 'setting_button',
                disabled: true,
                width: 150,
                listeners: {
                    click: this.onClickSettingsButton,
                    scope: this
                }
            }
        ]);
    }

});