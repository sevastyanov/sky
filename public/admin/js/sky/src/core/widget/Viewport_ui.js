Ext.define('sky.core.widget.Viewport_ui', {
	
	extend: 'Ext.container.Viewport',
	
	layout: {
		type: 'vbox',
		align: 'stretch'
	},

    maxWidth: 1280,
    minWidth: 1280,
    overflowX: 'auto',
	
	initComponent: function() {
		
		this.callParent(arguments);
		
		this.header = Ext.create('sky.core.widget.Header');

		this.add([
            this.header
		]);
		
	}
	
});