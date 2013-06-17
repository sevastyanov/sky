Ext.define('sky.core.widget.htmleditor.plugin.Image', {

    extend: 'Ext.util.Observable',

    init: function(cmp) {
        this.cmp = cmp;
        this.cmp.on('render', this.onRender, this);
        this.cmp.on('initialize', this.onInit, this, {delay:100, single: true});
    },

    onEditorMouseUp : function(e){
        console.log(this.cmp.getDoc().getSelection());
        /*Ext.get(e.getTarget()).select('img').each(function(el){
            var w = el.getAttribute('width'), h = el.getAttribute('height'), src = el.getAttribute('src')+' ';
            src = src.replace(new RegExp(this.urlSizeVars[0]+'=[0-9]{1,5}([&| ])'), this.urlSizeVars[0]+'='+w+'$1');
            src = src.replace(new RegExp(this.urlSizeVars[1]+'=[0-9]{1,5}([&| ])'), this.urlSizeVars[1]+'='+h+'$1');
            el.set({src:src.replace(/\s+$/,"")});
        }, this);*/
        
    },

    onInit: function(){
        Ext.EventManager.on(this.cmp.getDoc(), {
			mouseup: this.onEditorMouseUp,
			scope:   this,
            buffer:  100
		});
    },

    onRender: function() {
        this.cmp.getToolbar().add({
            xtype: 'button',
            iconCls: 'x-edit-image',
            handler: this.onClickButton,
            scope: this,
            tooltip: {
                title: 'Вставить картинку'
            },
            overflowText: this.langTitle
        });
    },

    onClickButton: function() {

        console.log(this.cmp.getDoc());

        Ext.create('sky.core.widget.file.FileManagerWindow', {
            listeners: {
                select_file: this.onFileSelect,
                scope: this
            }
        });
    },

    allowExtentions: {
        jpg: 1,
        png: 1,
        jpeg: 1,
        gif: 1
    },

    onFileSelect: function(file) {
        if (!this.allowExtentions.hasOwnProperty(file.get('ext'))) {
            return;
        }

        this.cmp.insertAtCursor('<img src="' + file.get('url') + '" title="' + file.get('name') + '" alt="' + file.get('name') + '">');
    },

    insertImage: function(img) {

    }
});