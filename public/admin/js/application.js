Ext.Loader.setConfig({
	enabled: true,
	paths: {
		'sky': '/admin/js/sky/src',
        'Ext': '/admin/js/extjs/src'
	}
});


Ext.onReady(function() {
    window.Sky = Ext.create('sky.core.Core', {
        modules: sky.moduleList
    });
    delete sky.moduleList;

    Ext.application({
        name: 'Admin',
        launch: function() {
            Ext.create('sky.core.widget.Viewport', {
            });
        }
    });
});

