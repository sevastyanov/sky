Ext.define('sky.core.widget.Tree_ui', {
    extend: 'Ext.tree.Panel',

    constructor: function() {

        this.loadingValue = 0;

        this.viewConfig = {
            plugins: {
                ptype: 'treeviewdragdrop'
            }
        };

        this.callParent(arguments);

        this.addDocked({
            xtype: 'toolbar',
            dock: 'top',
            items: [
                {
                    xtype: 'button',
                    text: 'Добавить',
                    listeners: {
                        click: this.onClickAddItem,
                        scope: this
                    }
                },
                {
                    xtype: 'button',
                    text: 'Добавить root',
                    listeners: {
                        click: this.onClickAddRoot,
                        scope: this
                    }
                },
                {
                    xtype: 'button',
                    text: 'Удалить',
                    listeners: {
                        click: this.onClickDeleteItem,
                        scope: this
                    }
                },
                {
                    xtype: 'component',
                    flex: 1
                }
            ]
        });

        this.view.on('drop', this.onDropItem, this);

    }


});