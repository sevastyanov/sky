Ext.define('sky.module.standart.static.action.text.StaticTextAction', {
    extend: 'sky.module.standart.static.action.text.StaticTextAction_ui',

    getData: function() {
        return this.queryById('text').getValue();
    },

    setData: function(data) {
        this.queryById('text').setValue(data || '');
    }

});