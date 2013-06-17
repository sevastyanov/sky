Ext.define('sky.module.standart.news.main.NewsEdit_ui', {

    extend: 'Ext.window.Window',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    autoShow: true,
    modal: true,

    bodyPadding: 3,
    width: '95%',
    height: '95%',

    initComponent: function() {
        this.callParent(arguments);

        this.add([
            {
                xtype: 'form',
                flex: 1,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                url: Sky.baseUrl + '/api?api_module=user&api_action=NewsEdit',
                itemId: 'edit_form',
                defaultType: 'textfield',
                bodyPadding: 3,
                items: [
                    {
                        name: 'id',
                        inputType: 'hidden',
                        allowBlank: true
                    },
                    {
                        fieldLabel: Sky._('Название'),
                        name: 'name',
                        allowBlank: false
                    },
                    Ext.create('sky.core.widget.TinyMCE', {
                        fieldLabel: Sky._('Краткое описание'),
                        name: 'description_short',
                        allowBlank: false,
                        flex: 1
                    }),
                    Ext.create('sky.core.widget.TinyMCE', {
                        fieldLabel: Sky._('Описание'),
                        name: 'description',
                        allowBlank: true,
                        flex: 2
                    }),
                    {
                        xtype: 'combo',
                        name: 'status',
                        fieldLabel: Sky._('Статус'),
                        store: Ext.create('Ext.data.Store', {
                            fields: ['code', 'title'],
                            data : [
                                {
                                    code: 'active',
                                    title: 'Активена'
                                },
                                {
                                    code: 'not_active',
                                    title: 'Отключена'
                                }
                            ]
                        }),
                        value: 'not_active',
                        editable: false,
                        queryMode: 'local',
                        displayField: 'title',
                        valueField: 'code'
                    }
                ],
                buttons: [{
                    text: Sky._('Сбросить'),
                    handler: this.onClick_reset,
                    scope: this
                }, {
                    text: Sky._('Сохранить'),
                    formBind: true, //only enabled once the form is valid
                    disabled: true,
                    handler: this.onClick_save,
                    scope: this
                }]
            }
        ]);
    }

});