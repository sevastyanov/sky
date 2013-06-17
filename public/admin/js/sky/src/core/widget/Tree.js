Ext.define('sky.core.widget.Tree', {
    extend: 'sky.core.widget.Tree_ui',

    module: 'moduleExample',
    rootName: 'Module Example',
    allowLoading: false,
    defaultNewName: 'Новый элемент',
    defaultNewCode: 'new_item',

    initComponent: function() {

        this.store = Ext.create('sky.core.store.TreeStore', {
            proxy: {
                type: 'ajax',
                url: Sky.baseUrl + '/api',
                extraParams: {
                    api_module: this.module,
                    api_action: 'Tree',
                    action: 'get'
                },
                reader: {
                    type: 'json',
                    root: 'result'
                }
            },
            root: {
                text: this.rootName,
                id: 0,
                expanded: true
            },
            folderSort: false,
            listeners: {
                load: this.onStoreLoad,
                scope: this
            }
        });

        this.callParent(arguments);
    },

    onStoreLoad: function(store, node, records, successful, eOpts) {

    },

    onClickAddItem: function() {
        var item = this.selModel.getLastSelected();

        this.createItem(item.get('id'));

    },

    createItem: function(parentId) {
        this.setLoading(true);

        Ext.Ajax.request({
            url: Sky.baseUrl + '/api?api_module=' + this.module + '&api_action=Tree&action=new',
            params: {
                parent_id: parentId,
                name: this.defaultNewName,
                code: this.defaultNewCode
            },
            success:  this.onAddItem_success,
            failure:  this.onAddItem_failure,
            callback: this.onAddItem_callback,
            scope:    this
        });
    },

    onClickAddRoot: function() {
        this.createItem(0);
    },

    onAddItem_success: function(response) {
        var data = Ext.decode(response.responseText);
        if (data.error_code === 0) {
            var newItem = this.selModel.getLastSelected().appendChild({
                    id: data.result.id,
                    text: data.result.name,
                    expandable: false
                });
            this.selectPath(newItem.getPath());
            this.fireEvent('itemclick', this, newItem, 'Внимание! Вызвано из sky.core.widget.Tree->onAddItem_success (на случай вопросов по нехватке параметров)');
        }
    },

    onAddItem_failure: function() {

    },

    onClickDeleteItem: function() {

        var item = this.selModel.getLastSelected();

        if (!item) {
            return;
        }

        this.setLoading(true);

        Ext.Ajax.request({
            url: Sky.baseUrl + '/api?api_module=' + this.module + '&api_action=Tree&action=delete',
            params: {
                api_data: Ext.JSON.encode({
                    id:   item.get('id')
                })
            },
            success:  this.onDeleteItem_success,
            failure:  this.onDeleteItem_failure,
            callback: this.onDeleteItem_callback,
            scope:    this
        });
    },

    onDeleteItem_success: function() {
        this.selModel.getLastSelected().remove();
    },

    onDeleteItem_callback: function() {
        this.setLoading(false);
    },

    onDeleteItem_failure: function() {
        this.getStore().reload();
    },

    saveItem: function(data, cfg) {
        this.setLoading(true);

        var item = this.store.getNodeById(data.id);

        item.set('text', data.name);
        item.commit();

        Ext.Ajax.request({
            url: Sky.baseUrl + '/api?api_module=' + this.module + '&api_action=Tree&action=edit',
            params: {
                api_data: Ext.JSON.encode(data)
            },
            success:  Ext.bind(this.onEditItem_success, this, [cfg], false),
            failure:  Ext.bind(this.onEditItem_failure, this, [cfg], false),
            callback: Ext.bind(this.onEditItem_callback, this, [cfg], false),
            scope:    this
        });
    },

    onEditItem_success: function(cfg) {

        if (cfg.success) {

            cfg.success.apply(cfg.scope || this);
        }
    },

    onEditItem_failure: function(cfg) {

        if (cfg.failure) {

            cfg.failure.apply(cfg.scope || this);
        }
    },

    onEditItem_callback: function(cfg) {
        this.setLoading(false);

        if (cfg.callback) {

            cfg.callback.apply(cfg.scope || this);
        }
    },

    onDropItem: function(node, data, overModel, dropPosition, eOpts) {

        this.setLoading(true);

        Ext.Ajax.request({
            url: Sky.baseUrl + '/api?api_module=' + this.module + '&api_action=Tree&action=move',
            params: {
                item_id:        data.records[0].internalId,
                target_item_id: overModel.internalId,
                position:       dropPosition
            },
            success:  this.onDropItem_success,
            failure:  this.onDropItem_failure,
            callback: this.onDropItem_callback,
            scope:    this
        });
    },

    onDropItem_success: function(response){
        var data = Ext.JSON.decode(response.responseText);
        console.log(data);
    },

    onDropItem_failure: function() {
        this.getStore().reload();
    },

    onDropItem_callback: function() {
        console.log(arguments);
        this.setLoading(false);
    },

    onAddItem_callback: function() {
        this.setLoading(false);
    }
});