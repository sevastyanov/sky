Ext.define('sky.module.standart.static.action.h1.StaticH1Action', {
    extend: 'sky.module.standart.static.action.h1.StaticH1Action_ui',

    getData: function() {
        return this.queryById('h1').getValue();
    },

    setData: function(data) {
        this.queryById('h1').setValue(data || '');
    }

});