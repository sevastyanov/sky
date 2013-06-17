Ext.define('sky.module.standart.news.main.NewsList_ui', {

    extend: 'sky.core.widget.BaseModuleEditor',

    needTree: false,

    mode: 'MODE_ITEMLIST',

    initItemList: function() {

        this.userStore = Ext.create('Ext.data.Store', {
            fields:['id', 'name', 'description_short', 'description', 'status'],
            autoLoad: false,
            pageSize: sky.core.widget.BaseModuleEditor.itemsPerPage,
            proxy: {
                type: 'ajax',
                url: Sky.baseUrl + '/api',
                extraParams: {
                    api_module: this.module.getCode(),
                    api_action: 'NewsList'
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
                    title: Sky._('Список новостей'),
                    store: this.userStore,
                    flex: 1,
                    columns: [
                        {
                            text: Sky._('ID'),
                            dataIndex: 'id'
                        },
                        {
                            text: Sky._('Название'),
                            dataIndex: 'name'
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