Ext.define('sky.module.standart.menu.main.MenuEditor', {

    extend: 'sky.module.standart.menu.main.MenuEditor_ui',

    initComponent: function() {
        this.callParent(arguments);
    },

    loadData: function(menu_id) {
        var data = {
            menu_id: menu_id
        };

        this.module.apiGet('ItemView', data, {
            failure: this.loadData_failure,
            success: this.loadData_success,
            scope:   this
        });

        this.setLoading(true, true);
    },

    loadData_failure: function(data) {

    },

    loadData_success: function(data) {

        this.setData(data);

        this.setLoading(false, true);
        this.rightContainer.enable();
    },

    setData: function(data) {
        this.menuId = data.id;
        this.queryById('name').setValue(data.name);
        this.queryById('status').setValue(data.status);

        if (data.page_hierarchy) {
            this.queryById('page').selectPath(data.page_hierarchy + data.page_id);
        } else {
            this.queryById('page').getSelectionModel().deselectAll();
        }

    },

    reload: function() {
        this.loadData(this.menuId);
    },

    onClickSave: function() {
        var data = {
            id:          this.menuId,
            name:        this.queryById('name').getValue(),
            status:      this.queryById('status').getValue(),
            page_id:     this.queryById('page').selModel.getLastSelected().get('id') || 0
        };

        this.tree.saveItem(data, {
            failure: this.saveData_failure,
            success: this.saveData_success,
            callback: this.saveData_callback,
            scope:   this
        });

        this.setLoading(true, true);
    },

    saveData_success: function() {
        this.reload();
    },

    saveData_callback: function() {
        this.setLoading(false, true);
    },

    saveData_failure: function() {

    }
});