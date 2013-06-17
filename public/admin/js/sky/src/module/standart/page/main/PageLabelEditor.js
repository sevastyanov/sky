Ext.define('sky.module.standart.page.main.PageLabelEditor', {
    extend: 'sky.module.standart.page.main.PageLabelEditor_ui',

    isRealModule: function(moduleCode) {
        return moduleCode && (moduleCode !== 'inherit')
    },

    initComponent: function() {
        this.callParent(arguments);

        this.labelData = {};

        this.setModule(this.data.module);

        if (this.isRealModule(this.data.module)) {
            this.setAction(this.data.action);
            this.setData(this.data.data);
        }

        this.label_id = !this.inherited ? this.data.id : false;
        this.modified = false;
    },

    setModule: function(moduleCode) {

        this.modified = true;

        this.queryById('module').setValue(moduleCode);

        this.labelData.module = moduleCode;

        var moduleActionCombo = this.queryById('module_action');

        moduleActionCombo.setValue('');

        if (!this.isRealModule(moduleCode)) {
            moduleActionCombo.setDisabled(true);
            return;
        }

        var moduleActions = Sky.getModule(moduleCode).getActionsList(),
            data = [];

        for (var actionCode in moduleActions) {
            if (!moduleActions.hasOwnProperty(actionCode)) {
                continue;
            }

            data.push({
                code: actionCode,
                title: moduleActions[actionCode]
            });
        }

        moduleActionCombo.getStore().loadData(data);
        moduleActionCombo.setDisabled(false);

    },

    setAction: function(actionCode) {

        this.modified = true;

        var setting_button = this.queryById('setting_button');

        this.labelData.action = actionCode;
        this.setData(false);

        this.queryById('module_action').setValue(actionCode);

        if (!this.isRealModule(this.labelData.module)) {
            setting_button.disable();
            return;
        }

        var editor = Sky.getModule(this.labelData.module).getActionEditor(actionCode);

        if (!editor) {
            setting_button.disable();
        } else {
            setting_button.enable();
        }
    },

    setData: function(data) {
        this.modified = true;
        this.labelData.data = data;
    },

    getData: function() {
        return this.labelData;
    },

    onChangeModule: function(combo, newValue, oldValue, eOpts) {
        this.setModule(newValue);
    },

    onChangeAction: function(combo, newValue, oldValue, eOpts) {
        this.setAction(newValue);
    },

    onClickSettingsButton: function() {
        var editor = Sky.getModule(this.labelData.module).getActionEditor(this.labelData.action);

        if (editor) {
            // подписываемся на события
            editor.on('close', this.onSettingsWindowClose, this);
            editor.on('save',  this.onSettingsWindowSave,  this);

            // рендерим окно, если надо
            if (!editor.rendered) {
                editor.doAutoRender();
            }

            // устанавливаем данные метки
            editor.setData(this.labelData.data);

            // показываем окно
            editor.show();
        }
    },

    /**
     * Вызывается редактором контента после его закрытия
     *
     * @param {sky.core.BaseActionEditor} editor
     */
    onSettingsWindowClose: function(editor) {
        // отписываемся от событий
        editor.un('close', this.onSettingsWindowClose, this);
        editor.un('save',  this.onSettingsWindowSave,  this);
    },


    /**
     * Вызывается редактором контента метки после нажатия кнопки "Сохранить" во всплывающем окне
     *
     * @param {Object} data
     */
    onSettingsWindowSave: function(data) {
        this.setData(data);
    }
});