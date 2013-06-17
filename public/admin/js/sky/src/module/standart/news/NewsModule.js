Ext.define('sky.module.standart.news.NewsModule', {

    extend: 'sky.core.BaseModule',

    getCode: function() {
        return 'news';
    },

    getTitle: function() {
        return Sky._('Новости');
    },

    getActionsList: function() {
        return {
            list:  Sky._('Список новостей'),
            one:  Sky._('Описание новости')
        };
    },

    getEditorClassName: function() {
        return 'sky.module.standart.news.main.NewsList';
    },

    getActionEditorClassName: function(actionCode) {
        switch (actionCode) {
            case 'list':
                return 'sky.module.standart.news.action.list.NewsListAction';
            default:
                return false;
        }
    }

});