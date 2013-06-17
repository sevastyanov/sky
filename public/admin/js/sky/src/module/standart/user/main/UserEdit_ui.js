Ext.define('sky.module.standart.user.main.UserEdit_ui', {

    extend: 'Ext.window.Window',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    autoShow: true,
    modal: true,

    bodyPadding: 3,
    width: 600,

    initComponent: function() {
        this.callParent(arguments);

        this.add([
            {
                xtype: 'form',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                url: Sky.baseUrl + '/api?api_module=user&api_action=UserEdit',
                itemId: 'user_form',
                defaultType: 'textfield',
                bodyPadding: 3,
                items: [
                    {
                        name: 'id',
                        inputType: 'hidden',
                        allowBlank: true
                    },
                    {
                        fieldLabel: Sky._('Логин'),
                        name: 'login',
                        allowBlank: false
                    },
                    {
                        fieldLabel: Sky._('Пароль'),
                        name: 'password',
                        allowBlank: true,
                        inputType: 'password'
                    },
                    {
                        fieldLabel: Sky._('Фамилия'),
                        name: 'lastname',
                        allowBlank: false
                    },
                    {
                        fieldLabel: Sky._('Имя'),
                        name: 'firstname',
                        allowBlank: false
                    },
                    {
                        fieldLabel: Sky._('Отчество'),
                        name: 'patronymic',
                        allowBlank: false
                    },
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
                    processResponse: function(response) {
                        debugger
                    },
                    scope: this
                }]
            }
        ]);
    }

});