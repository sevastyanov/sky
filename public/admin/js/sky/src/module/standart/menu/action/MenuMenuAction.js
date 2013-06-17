Ext.define('sky.module.standart.menu.action.MenuMenuAction', {
    extend: 'sky.module.standart.menu.action.MenuMenuAction_ui',

    getData: function() {
        return {
            id:   this.queryById('menu').getValue(),
            type: this.queryById('type').getValue()
        };
    },

    setData: function(data) {
        try {
            this.queryById('menu').setValue(data.id || 0);
            this.queryById('type').setValue(data.type || 'horizontal');
        } catch (e) {
            this.queryById('type').setValue('horizontal');
        }
        this.queryById('menu').getStore().reload();
    }

});