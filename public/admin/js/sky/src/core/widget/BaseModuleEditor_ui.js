Ext.define('sky.core.widget.BaseModuleEditor_ui', {

    extend: 'Ext.container.Container',

    module: 'page',

    MODE_ITEMEDITOR: 'MODE_ITEMEDITOR',
    MODE_ITEMLIST:   'MODE_ITEMLIST',

    mode: 'MODE_ITEMEDITOR',

    layout: {
        type:  'hbox',
        align: 'stretch'
    },

    needTree: true,

    initTree: function() {

        if (!this.needTree) {
            return;
        }

        this.tree = Ext.create('sky.core.widget.Tree', {
            width: 300,
            module: this.module.getCode(),
            rootName: 'Root',
            rootVisible: false,
            listeners: {
                itemclick: this.onClick_treeItem,
                scope: this
            }
        })
    },

    initRightContainer: function() {

        switch (this.mode) {
            case this.MODE_ITEMEDITOR:
                this.initItemEditor();
                break;
            case this.MODE_ITEMLIST:
                this.initItemList();
                break;
        }
    },

    initItemEditor: function() {

    },

    initItemList: function() {

    },

    initComponent: function() {

        this.callParent(arguments);

        this.initTree();
        this.initRightContainer();

        var components = [];

        if (this.tree) {
            components.push(this.tree);
        }

        components.push(this.rightContainer);

        this.add(components);

    }
});