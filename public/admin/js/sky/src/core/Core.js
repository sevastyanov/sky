Ext.define('sky.core.Core', {
    baseUrl: '/admin',

    config: {
        modules: {}
    },

    constructor: function(cfg) {
        this.initConfig(cfg);

        this.dispatcher = Ext.create('sky.core.Dispatcher');

        for (var moduleCode in this.modules) {
            if (!this.modules.hasOwnProperty(moduleCode)) {
                continue;
            }
            var className = this.modules[moduleCode].className;
            Ext.require(className, Ext.bind(this.onLoadModule, this, [moduleCode, className]));
        }

        this.callParent(arguments);
    },

    onLoadModule: function(moduleCode, className) {
        this.modules[moduleCode].class = Ext.ClassManager.get(className);
        console.log(this.modules);
    },

    getModuleClass: function(moduleCode) {
        if (!this.modules.hasOwnProperty(moduleCode)) {
            return false;
        }

        return this.modules[moduleCode].class;

    },

    getModule: function(moduleCode) {
        if (!this.modules.hasOwnProperty(moduleCode)) {
            return false;
        }

        var moduleData = this.modules[moduleCode];

        if (!moduleData.instance) {
            moduleData.instance = Ext.create(moduleData.className);
        }

        return moduleData.instance;

    },

    _: function(text) {
        return text;
    }
});