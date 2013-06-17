Ext.define('sky.module.standart.news.main.NewsEdit', {

    extend: 'sky.module.standart.news.main.NewsEdit_ui',

    onClick_reset: function() {
        if (this.userRecord) {
            this.queryById('edit_form').getForm().loadRecord(this.newsRecord);
        } else {
            this.queryById('edit_form').getForm().reset();
        }
    },

    onClick_save: function() {
        var form = this.queryById('edit_form').getForm();

        if (form.isValid()) {
            this.module.apiPost('NewsEdit', form.getValues(), {
                success: this.onSaveSuccess,
                failure: this.onSaveFailure,
                scope: this
            });
        }
    },

    onSaveSuccess: function(form, action) {

        Ext.Msg.alert('', Sky._('Данные успешно сохранены'));

        if (this.newsRecord) {
            this.newsRecord.set(this.queryById('edit_form').getForm().getValues());
            this.newsRecord.commit();
        }

        this.fireEvent('save');
        this.close();
    },

    onSaveFailure: function(form, action) {
        Ext.Msg.alert('', Sky._('Произошла ошибка при сохранении данных'));
    },

    setData: function(record) {
        this.newsRecord = record;
        var form = this.queryById('edit_form').getForm();
        debugger
        form.loadRecord(this.newsRecord);
    }

});