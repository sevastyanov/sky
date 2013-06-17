Ext.define('sky.core.widget.Header_ui', {
	
	extend: 'Ext.panel.Panel',
	
	flex: 0,
	
	initComponent: function() {
		this.callParent(arguments);

        var modules = Sky.modules,
            buttons = [];

        for (var moduleCode in modules) {
            if (!modules.hasOwnProperty(moduleCode)) {
                continue;
            }

            var module = modules[moduleCode];

            if (!module.visible) {
                continue;
            }

            buttons.push({
                xtype: 'button',
                text: Sky.getModule(moduleCode).getTitle(),
                listeners: {
                    scope: this,
                    click: Ext.bind(this.onClick_buttonModule, this, [moduleCode])
                }
            });
        }

		this.add([
		    {
		    	xtype: 'toolbar',
		    	items: buttons,
                layout: {
                    overflowHandler: 'Menu'
                }
		    }
		]);
	}
	
});