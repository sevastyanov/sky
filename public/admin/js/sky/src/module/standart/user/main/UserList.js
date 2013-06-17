Ext.define('sky.module.standart.user.main.UserList', {

    extend: 'sky.module.standart.user.main.UserList_ui',

    onItemDblClick: function(grid, record, item, index, e, eOpts) {
        var wnd = Ext.create('sky.module.standart.user.main.UserEdit', {
            title: Sky._('Редактирование учётной записи'),
            module: this.module
        });
        wnd.setData(record);
    },

    onClickAdd: function() {
        Ext.create('sky.module.standart.user.main.UserEdit', {
            title: Sky._('Создание учётной записи'),
            module: this.module,
            listeners: {
                save: this.onUserCreated,
                scope: this
            }
        });
    },

    onUserCreated: function() {
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