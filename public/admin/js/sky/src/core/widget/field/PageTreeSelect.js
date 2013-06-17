Ext.define('sky.core.widget.field.PageTreeSelect', {

    extend: 'Ext.tree.Panel',
    rootVisible: false,
    border: 0,
    bodyBorder: 0,

    constructor: function() {

        this.pageModule = Sky.getModule('page');

        this.store = Ext.create('sky.core.store.TreeStore', {
            proxy: {
                type: 'ajax',
                url: Sky.baseUrl + '/api',
                extraParams: {
                    api_module: 'page',
                    api_action: 'Tree',
                    action: 'get'
                },
                reader: {
                    type: 'json',
                    root: 'result'
                }
            },
            root: {
                text: 'pages',
                id: 0,
                expanded: false
            },
            folderSort: false
        });

        this.callParent(arguments);

        if (this.hasOwnProperty('value')) {
            this.setValue(this.value);
        }

        this.on('itemclick', this.onClickItem, this);
    },

    setValue: function(page_id) {

        this.value = page_id;

        if (page_id > 0) {

            this.pageModule.apiGet('ItemView', {
                page_id: page_id
            }, {
                success: this.onLoadPageInfoSuccess,
                scope: this
            });

        }
    },

    getValue: function() {
        return this.value;
    },

    onLoadPageInfoSuccess: function(data) {
        var path = data.hierarchy + data.id;
        this.selectPath(path);
    },

    onClickItem: function(tree, record, item, index, e, eOpts) {
        this.value = record.get('id');
    }

});