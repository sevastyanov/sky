Ext.define('sky.module.standart.menu.MenuModule', {

    extend: 'sky.core.BaseModule',

    getCode: function() {
        return 'menu';
    },

    getTitle: function() {
        return Sky._('Меню');
    },

    getActionsList: function() {
        return {
            menu:  Sky._('Меню')
        };
    },

    getEditorClassName: function() {
        return 'sky.module.standart.menu.main.MenuEditor';
    },

    getActionEditorClassName: function(actionCode) {
        switch (actionCode) {
            case 'menu':
                return 'sky.module.standart.menu.action.MenuMenuAction';
            default:
                return false;
        }
    }

});