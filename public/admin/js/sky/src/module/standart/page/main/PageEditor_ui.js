Ext.define('sky.module.standart.page.main.PageEditor_ui', {

    extend: 'sky.core.widget.BaseModuleEditor',

    module: 'page',

    initModuleStore: function() {

        var modules = Sky.modules,
            data = [{
                code: 'inherit',
                title: Sky._('Унаследовано')
            }];

        for (var code in modules) {
            if (!modules.hasOwnProperty(code)) {
                continue;
            }

            var module = Sky.getModule(code),
                actions = module.getActionsList();

            if (actions) {
                data.push({
                    code: code,
                    title: module.getTitle()
                });
            }
        }

        this.moduleStore = Ext.create('Ext.data.Store', {
            fields: ['code', 'title'],
            data : data
        });
    },

    initItemEditor: function() {

        this.initModuleStore();

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
                            itemId: 'page_name',
                            fieldLabel: Sky._('Название'),
                            labelWidth: 100
                        },
                        {
                            xtype: 'textfield',
                            itemId: 'page_code',
                            fieldLabel: Sky._('Код'),
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
                                        title: 'Активена'
                                    },
                                    {
                                        code: 'not_active',
                                        title: 'Отключена'
                                    }
                                ]
                            }),
                            editable: false,
                            queryMode: 'local',
                            displayField: 'title',
                            valueField: 'code'
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: Sky._('TKD'),
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            itemId: 'title',
                            fieldLabel: Sky._('Заголовок'),
                            labelWidth: 100
                        },
                        {
                            xtype: 'textfield',
                            itemId: 'keywords',
                            fieldLabel: Sky._('Ключевые слова'),
                            labelWidth: 100
                        },
                        {
                            xtype: 'textarea',
                            itemId: 'description',
                            fieldLabel: Sky._('Описание'),
                            labelWidth: 100
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: Sky._('Шаблон страницы'),
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'combo',
                            itemId: 'template',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['code', 'title'],
                                data : []
                            }),
                            editable: false,
                            queryMode: 'local',
                            displayField: 'title',
                            valueField: 'code',
                            listeners: {
                                change: this.onChangeTemplate,
                                scope: this
                            }
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    title: Sky._('Настройки меток'),
                    itemId: 'labels_container',
                    autoDestroy: false,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    bodyPadding: 5,
                    items: []
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