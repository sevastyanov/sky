Ext.define('sky.core.BaseModule', {

    constructor: function() {

        this.editorInstance = null;
        this.actionEditors = {};

        this.callParent(arguments);
    },

    getCode: function() {
        throw 'Вызов абстрактного метода';
    },

    getTitle: function() {
        throw 'Вызов абстрактного метода';
    },

    getActionsList: function() {
        throw 'Вызов абстрактного метода';
    },

    getEditorClassName: function() {
        throw 'Вызов абстрактного метода';
    },

    getActionEditorClassName: function(actionCode) {
        throw 'Вызов абстрактного метода';
    },

    parseApiAnswer: function(response) {

        switch (response.getResponseHeader('Content-Type')) {
            case 'application/json':
                try {
                    var result = Ext.JSON.decode(response.responseText);

                    if (result.hasOwnProperty('error_code') && result.hasOwnProperty('error_message') && result.hasOwnProperty('result')) {
                        return result;
                    }

                } catch (e) {}
        }

        return {
            error_code:    10000,
            error_message: Sky._('Ошибка при разборе ответа от сервера'),
            result:       false
        };

    },

    api: function(requestMethod, action, data, cfg) {

        var scope    = cfg.scope || this,
            success  = Ext.bind(cfg.success  || Ext.emptyFn, scope),
            failure  = Ext.bind(cfg.failure  || Ext.emptyFn, scope),
            callback = Ext.bind(cfg.callback || Ext.emptyFn, scope);

        Ext.Ajax.request({
            url: Sky.baseUrl + '/api',
            method: requestMethod,
            params: {
                api_module: this.getCode().toLowerCase(),
                api_action: action,
                api_data: Ext.JSON.encode(data)
            },
            success:  Ext.bind(this.onApiSuccess,  this, [success],  true),
            failure:  Ext.bind(this.onApiFailure,  this, [failure],  true),
            callback: Ext.bind(this.onApiCallBack, this, [callback], true)
        });
    },

    /**
     * Получение данных через API
     *
     * @param {String} action
     * @param {Object} data
     * @param {Object} cfg
     */
    apiGet: function(action, data, cfg) {
        this.api('get', action, data, cfg);
    },

    /**
     * Запрос на изменение данных через API
     *
     * @param {String} action
     * @param {Object} data
     * @param {Object} cfg
     */
    apiPost: function(action, data, cfg) {
        this.api('post', action, data, cfg);
    },

    onApiSuccess: function(response, opts, callBack) {
        var result = this.parseApiAnswer(response);

        callBack(
            result.result
        );
    },

    onApiFailure: function(response, opts, callBack) {
        callBack(
            this.parseApiAnswer(response)
        );
    },

    onApiCallBack: function(opts, success, response, callBack) {
        callBack(
            this.parseApiAnswer(response)
        );
    },

    getActionEditor: function(actionCode) {
        if (!this.actionEditors.hasOwnProperty(actionCode)) {
            var className = this.getActionEditorClassName(actionCode);

            if (className) {

                var actionList = this.getActionsList();

                if (actionList.hasOwnProperty(actionCode)) {
                    this.actionEditors[actionCode] = Ext.create(className, {
                        title: actionList[actionCode]
                    });
                } else {
                    this.actionEditors[actionCode] = false;
                }

            } else {
                this.actionEditors[actionCode] = false;
            }
        }
        return this.actionEditors[actionCode];
    },

    editorAvailable: function() {
        return true;
    },

    getEditor: function() {

        if (!this.editorInstance) {
            this.editorInstance = Ext.create(this.getEditorClassName(), {
                module: this
            });
        }

        return this.editorInstance;
    },

    indexAction: function() {
        return this.getEditor();
    }

});