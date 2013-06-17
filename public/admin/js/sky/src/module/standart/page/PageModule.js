Ext.define('sky.module.standart.page.PageModule', {

    extend: 'sky.core.BaseModule',

    getCode: function() {
        return 'page';
    },

    getTitle: function() {
        return Sky._('Страницы');
    },

    getActionsList: function() {
        return false;
    },

    getEditorClassName: function() {
        return 'sky.module.standart.page.main.PageEditor';
    },

    getActionEditorClassName: function(actionCode) {
        throw 'У модуля Page нет экшенов';
    }

});