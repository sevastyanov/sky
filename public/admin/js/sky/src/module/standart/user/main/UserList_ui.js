Ext.define('sky.module.standart.user.main.UserList_ui', {

    extend: 'sky.core.widget.BaseModuleEditor',

    needTree: false,

    mode: 'MODE_ITEMLIST',

    initItemList: function() {

        this.userStore = Ext.create('Ext.data.Store', {
            fields:['id', 'login', 'lastname', 'firstname', 'patronymic', 'status'],
            autoLoad: false,
            pageSize: sky.core.widget.BaseModuleEditor.itemsPerPage,
            proxy: {
                type: 'ajax',
                url: Sky.baseUrl + '/api',
                extraParams: {
                    api_module: this.module.getCode(),
                    api_action: 'UserList'
                },
                reader: {
                    type: 'json',
                    root: 'result.items',
                    totalProperty: 'result.total'
                }
            }
        });

        this.reloadList();

        this.rightContainer = Ext.create('Ext.container.Container', {
            flex: 1,
            padding: 3,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            autoScroll: true,
            items: [
                {
                    xtype: 'grid',
                    title: Sky._('Список пользователей'),
                    store: this.userStore,
                    flex: 1,
                    columns: [
                        {
                            text: Sky._('ID'),
                            dataIndex: 'id'
                        },
                        {
                            text: Sky._('Логин'),
                            dataIndex: 'login'
                        },
                        {
                            text: Sky._('Фамилия'),
                            dataIndex: 'lastname',
                            flex: 1
                        },
                        {
                            text: Sky._('Имя'),
                            dataIndex: 'firstname'
                        },
                        {
                            text: Sky._('Отчество'),
                            dataIndex: 'patronymic'
                        },
                        {
                            text: Sky._('Статус'),
                            dataIndex: 'status'
                        }
                    ],
                    dockedItems: [
                        {
                            xtype: 'pagingtoolbar',
                            store: this.userStore,
                            dock: 'bottom',
                            displayInfo: true
                        },
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            items: [
                                {
                                    xtype: 'button',
                                    text: 'Создать',
                                    handler: this.onClickAdd,
                                    scope: this
                                }
                            ]
                        }],
                    listeners: {
                        scope: this,
                        itemdblclick: this.onItemDblClick
                    }
                }
            ]
        });

    }

});