Ext.define('sky.module.standart.page.main.PageEditor', {

    extend: 'sky.module.standart.page.main.PageEditor_ui',

    initComponent: function() {
        this.callParent(arguments);

        this.templates = {};
        this.template = 'main';

        this.labelsData = {};
        this.labelEditors = {};

        this.module.apiGet('TemplatesInfo', null, {
            success: this.loadTemplates_success,
            scope:   this
        });
    },

    loadTemplates_success: function(templates) {
        this.templates = templates;

        var list = [];

        for (var code in templates) {
            if (!templates.hasOwnProperty(code)) {
                continue;
            }
            list.push({
                code: code,
                title: Sky._(templates[code].title)
            })
        }

        var combo = this.queryById('template');
        combo.getStore().loadData(list);
        combo.setValue(combo.getValue());

        this.reloadLabelEditors();
    },

    onChangeTemplate: function(combo, newValue, oldValue, eOpts) {
        this.template = newValue;
        this.reloadLabelEditors();
    },

    loadData: function(page_id) {

        var data = {
            page_id: page_id
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

        this.setData({
            id: data.id,
            page_code: data.code,
            page_name: data.name,
            title: data.title,
            keywords: data.keywords,
            description: data.description,
            labels: data.labels,
            template: data.template,
            status: data.status
        });

        this.setLoading(false, true);
        this.rightContainer.enable();
    },

    reloadLabelEditors: function() {

        var labels_container = this.queryById('labels_container'),
            labels = this.labelsData,
            labelEditors = [],
            tplInfo = this.templates[this.template];

        if (tplInfo && tplInfo.labels) {

            for (var labelCode in tplInfo.labels) {

                if (!tplInfo.labels.hasOwnProperty(labelCode)) {
                    continue;
                }

                if (!this.labelEditors.hasOwnProperty(labelCode)) {

                    var data = {
                        module: ''
                    };

                    if (labels.hasOwnProperty(labelCode)) {
                        data = labels[labelCode];
                    }

                    if (data.inherited) {
                        data = {
                            module: 'inherit'
                        };
                    }

                    this.labelEditors[labelCode] = Ext.create('sky.module.standart.page.main.PageLabelEditor', {
                        moduleStore: this.moduleStore,
                        pageModule: this.module,
                        labelCode: labelCode,
                        data: data
                    });
                }

                this.labelEditors[labelCode].setTitle(tplInfo.labels[labelCode]);
                labelEditors.push(this.labelEditors[labelCode]);
            }

        }

        labels_container.removeAll();
        labels_container.add(labelEditors);
    },

    reload: function() {
        this.loadData(this.pageId);
    },

    setData: function(data) {
        this.pageId = data.id;

        this.queryById('page_code').setValue(data.page_code);
        this.queryById('page_name').setValue(data.page_name);
        this.queryById('status').setValue(data.status);
        this.queryById('title').setValue(data.title);
        this.queryById('keywords').setValue(data.keywords);
        this.queryById('description').setValue(data.description);
        this.queryById('template').setValue(data.template);

        this.template = data.template;
        this.labelEditors = {};
        this.labelsData = data.labels;

        this.reloadLabelEditors();

    },

    onClickSave: function() {
        var data = {
            id:          this.pageId,
            code:        this.queryById('page_code').getValue(),
            name:        this.queryById('page_name').getValue(),
            status:      this.queryById('status').getValue(),
            title:       this.queryById('title').getValue(),
            keywords:    this.queryById('keywords').getValue(),
            description: this.queryById('description').getValue(),
            template:    this.queryById('template').getValue(),
            labels:      []
        };

        for (labelCode in this.labelEditors) {
            if (!this.labelEditors.hasOwnProperty(labelCode)) {
                continue;
            }

            var editor = this.labelEditors[labelCode];

            if (editor.modified) {
                var labelData   = editor.getData();
                labelData.id    = editor.label_id || null;
                labelData.label = labelCode;

                data.labels.push(labelData);
            }
        }


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