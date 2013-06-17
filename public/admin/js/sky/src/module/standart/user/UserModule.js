Ext.define('sky.module.standart.user.UserModule', {

    extend: 'sky.core.BaseModule',

    getCode: function() {
        return 'user';
    },

    getTitle: function() {
        return Sky._('Пользователи');
    },

    getActionsList: function() {
        return {
            auth:  Sky._('Форма авторизации')
        };
    },

    getEditorClassName: function() {
        return 'sky.module.standart.user.main.UserList';
    },

    getActionEditorClassName: function(actionCode) {
        switch (actionCode) {
            case 'auth':
            default:
                return false;
        }
    }

});