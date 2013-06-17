Ext.define('sky.core.widget.BaseModuleEditor', {

    extend: 'sky.core.widget.BaseModuleEditor_ui',

    onClick_treeItem: function(tree, record, item, index, e, eOpts) {
        this.loadData(record.get('id'));
    }

});

sky.core.widget.BaseModuleEditor.itemsPerPage = 25;