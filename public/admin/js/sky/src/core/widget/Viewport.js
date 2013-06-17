Ext.define('sky.core.widget.Viewport', {
	
	extend: 'sky.core.widget.Viewport_ui',
	
	initComponent: function() {

		this.callParent(arguments);

        Sky.viewport = this;

        Sky.dispatcher.on('state_change', this.onStateChange, this);

        this.onStateChange(Sky.dispatcher.state);

	},

    onStateChange: function(state) {

        var module = Sky.getModule(state.module),
            actionName = state.action + 'Action';

        var page = module[actionName](state);
        page.flex = 1;

        if (this.currentPage) {
            this.remove(this.currentPage, false);
        }

        this.currentPage = page;

        this.add(page);

    }
	
});