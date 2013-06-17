Ext.define('sky.core.widget.file.FileManager_ui', {

    extend: 'Ext.Panel',
    title: 'Simple DataView (0 items selected)',
    cls: 'ext-ux-data-view',

    initComponent: function() {

        var me = this;

        this.callParent(arguments);

        this.store = Ext.create('Ext.data.Store', {
            fields: [
                {name: 'is_dir'},
                {name: 'name'},
                {name: 'ext'},
                {name: 'url'},
                {name: 'icon_url'},
                {name: 'size', type: 'float'},
                {name:'lastmod', type:'date', dateFormat:'timestamp'}
            ],
            data: []
        });

        this.add([

            {
                xtype: 'toolbar',
                items: [
                    Ext.create('sky.core.widget.file.FileUploader', {
                        listeners: {
                            scope: this,
                            upload: this.onFilesUpload
                        }
                    })
                ]
            },

            Ext.create('Ext.view.View', {
                store: this.store,
                tpl: [
                    '<tpl for=".">',
                    '<div class="thumb-wrap" id="{name:stripTags}">',
                    '<div class="thumb"><img src="{icon_url}" title="{name:htmlEncode}"></div>',
                    '<span class="x-editable">{shortName:htmlEncode}</span>',
                    '</div>',
                    '</tpl>',
                    '<div class="x-clear"></div>'
                ],
                multiSelect: true,
                height: 310,
                trackOver: true,
                overItemCls: 'x-item-over',
                itemSelector: 'div.thumb-wrap',
                emptyText: 'No images to display',
                plugins: [
                    Ext.create('Ext.ux.DataView.DragSelector', {}),
                    //Ext.create('Ext.ux.DataView.LabelEditor', {dataIndex: 'name'})
                ],
                prepareData: function(data) {

                    var urlParts = data.url.split('.'),
                        ext = urlParts.pop(),
                        extention = 'default',
                        iconUrl = Sky.baseUrl + '/image/file-icons/';

                    if (me.extentions.hasOwnProperty(ext)) {
                        extention = ext;
                    }

                    if (data.is_dir) {
                        extention = 'folder';
                        data.ext = '';
                    } else {
                        data.ext = ext;
                    }

                    iconUrl += extention + '.png';

                    Ext.apply(data, {
                        icon_url: iconUrl,
                        shortName: Ext.util.Format.ellipsis(data.name, 15),
                        sizeString: Ext.util.Format.fileSize(data.size),
                        dateString: Ext.util.Format.date(data.lastmod, "m/d/Y g:i a")
                    });

                    return data;
                },
                listeners: {
                    selectionchange: function(dv, nodes ){
                        var l = nodes.length,
                            s = l !== 1 ? 's' : '';
                        this.setTitle('Simple DataView (' + l + ' item' + s + ' selected)');
                    },
                    itemdblclick: this.onItemDblClick,
                    scope: this
                }
            })

        ]);

    }

});