Ext.define('sky.module.standart.menu.main.MenuEditor_ui', {

    extend: 'sky.core.widget.BaseModuleEditor',

    module: 'menu',

    initItemEditor: function() {

        this.rightContainer = Ext.create('Ext.container.Container', {
            flex: 1,
            padding: 3,
            disabled: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            autoScroll: true,
            items: [
                {
                    xtype: 'fieldset',
                    title: Sky._('Главные настройки'),
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            itemId: 'name',
                            fieldLabel: Sky._('Название'),
                            labelWidth: 100
                        },
                        {
                            xtype: 'combo',
                            itemId: 'status',
                            fieldLabel: Sky._('Статус'),
                            store: Ext.create('Ext.data.Store', {
                                fields: ['code', 'title'],
                                data : [
                                    {
                                        code: 'active',
                                        title: 'Активен'
                                    },
                                    {
                                        code: 'not_active',
                                        title: 'Отключен'
                                    }
                                ]
                            }),
                            editable: false,
                            queryMode: 'local',
                            displayField: 'title',
                            valueField: 'code'
                        },
                        {
                            xtype: 'fieldset',
                            title: Sky._('Связанная страница'),
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            padding: 5,
                            items: [
                                Ext.create('sky.core.widget.field.PageTreeSelect', {
                                    itemId: 'page'
                                })
                            ]
                        }

                    ]
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    padding: '5 0 0 0',
                    items: [
                        {
                            xtype: 'component',
                            flex: 1
                        },
                        {
                            xtype: 'button',
                            width: 100,
                            text: Sky._('Сохранить'),
                            listeners: {
                                click: this.onClickSave,
                                scope: this
                            }
                        }
                    ]
                }
            ]
        });

    }

});