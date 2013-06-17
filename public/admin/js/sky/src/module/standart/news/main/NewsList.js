Ext.define('sky.module.standart.news.main.NewsList', {

    extend: 'sky.module.standart.news.main.NewsList_ui',

    onItemDblClick: function(grid, record, item, index, e, eOpts) {
        var wnd = Ext.create('sky.module.standart.news.main.NewsEdit', {
            title: Sky._('Редактирование новости'),
            module: this.module
        });
        wnd.setData(record);
    },

    onClickAdd: function() {
        Ext.create('sky.module.standart.news.main.NewsEdit', {
            title: Sky._('Создание новости'),
            module: this.module,
            listeners: {
                save: this.onItemCreated,
                scope: this
            }
        });
    },

    onItemCreated: function() {
        this.reloadList();
    },

    reloadList: function() {
        this.userStore.load({
            params:{
                start:0,
                limit: sky.core.widget.BaseModuleEditor.itemsPerPage
            }
        });
    }

});