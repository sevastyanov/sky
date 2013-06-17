Ext.define('sky.core.widget.Header', {
	
	extend: 'sky.core.widget.Header_ui',

    onClick_buttonModule: function(moduleCode) {
        Sky.dispatcher.setState({
            module: moduleCode,
            action: 'index'
        });
    }
	
});