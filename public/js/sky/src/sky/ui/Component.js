Sky.define('sky.ui.Component', {
	
	extend: 'sky.ObservableClass',
	
	config: {
		renderTo: '',
		elTag: 'div'
	},
	
	__construct: function() {
		
		this._init();
		this._initEvemts();
		
		if (this.renderTo) {
			$(this.renderTo).append(this.el);
		}
	},
	
	_init: function() {
		this.el  = document.createElement(this.elTag);
		this.$el = $(this.el);
	},
	
	_initEvemts: function() {
		
	}
	
});