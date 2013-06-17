Ext.define('sky.module.standart.static.action.image.StaticImageAction_ui', {
    extend: 'sky.core.BaseActionEditor',

    width: 900,
    height: 600,

    layout: 'auto',

    initComponent: function() {
        this.callParent(arguments);

        this.add([
            {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'strecth'
                },
                margin: '2 0 2 0',
                items: [
                    {
                        xtype: 'textfield',
                        id: 'link',
                        flex: 1
                    },
                    {
                        xtype: 'button',
                        text: 'Выбрать',
                        margins: '0 0 0 2',
                        listeners: {
                            click: this.onClickButton,
                            scope: this
                        }
                    }
                ]
            },
            {
                xtype: 'image',
                id: 'img',
                flex: 1,
                style: {
                    maxWidth: '890px',
                    maxHeight: '500px'
                }
            }
        ]);
    }
});