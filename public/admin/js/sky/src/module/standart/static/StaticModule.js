Ext.define('sky.module.standart.static.StaticModule', {

    extend: 'sky.core.BaseModule',

    getCode: function() {
        return 'static';
    },

    getTitle: function() {
        return Sky._('Статика');
    },

    getActionsList: function() {
        return {
            text:  Sky._('Текст'),
            h1:    Sky._('H1'),
            image: Sky._('Ссылка на изображение')
        };
    },

    getEditorClassName: function() {
        return false;
    },

    editorAvailable: function() {
        return false;
    },

    getActionEditorClassName: function(actionCode) {
        switch (actionCode) {
            case 'text':
                return 'sky.module.standart.static.action.text.StaticTextAction';
            case 'h1':
                return 'sky.module.standart.static.action.h1.StaticH1Action';
            case 'image':
                return 'sky.module.standart.static.action.image.StaticImageAction';
            default:
                return false;
        }
    }

});