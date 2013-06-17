Ext.define('sky.module.standart.news.action.list.NewsListAction', {
    extend: 'sky.module.standart.news.action.list.NewsListAction_ui',

    getData: function() {
        return this.queryById('page').getValue();
    },

    setData: function(data) {
        this.queryById('page').setValue(data || 0);
    }

});