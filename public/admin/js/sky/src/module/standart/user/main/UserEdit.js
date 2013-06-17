Ext.define('sky.module.standart.user.main.UserEdit', {

    extend: 'sky.module.standart.user.main.UserEdit_ui',

    onClick_reset: function() {
        if (this.userRecord) {
            this.queryById('user_form').getForm().loadRecord(this.userRecord);
        } else {
            this.queryById('user_form').getForm().reset();
        }
    },

    onClick_save: function() {
        var form = this.queryById('user_form').getForm();

        if (form.isValid()) {
            this.module.apiPost('UserEdit', form.getValues(), {
                success: this.onSaveSuccess,
                failure: this.onSaveFailure,
                scope: this
            });
        }
    },

    onSaveSuccess: function(form, action) {

        Ext.Msg.alert('', Sky._('Данные пользователя успешно сохранены'));

        if (this.userRecord) {
            this.userRecord.set(this.queryById('user_form').getForm().getValues());
            this.userRecord.commit();
        }

        this.fireEvent('save');
        this.close();
    },

    onSaveFailure: function(form, action) {
        Ext.Msg.alert('', Sky._('Произошла ошибка при сохранении данных пользователя'));
    },

    setData: function(record) {
        this.userRecord = record;
        this.queryById('user_form').getForm().loadRecord(this.userRecord);
    }

});