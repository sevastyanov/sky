Sky.define('sky.ui.InlineEditor', {
   
    extend: 'sky.ui.Component',
    
    config: {
        saveUrl: ''
    },

    _init: function() {
        this.callParent(arguments);

        this.$el.addClass('sky-ui-InlineEditor');
        this.$el.attr('contenteditable', 'true');
        
        this.setText($(this.renderTo).text(), true);
        $(this.renderTo).text('');
    },

    _initEvemts: function() {
        this.$el.on('blur', this.onBlur.bind(this));
    },
    
    
    setText: function(text, notSave) {
        this.$el.text(text);
        
        if (text !== this.text && !notSave) {
            $.ajax({
                url:     this.saveUrl,
                type:    'post',
                success: this.onSaveSuccess.bind(this),
                error:   this.onSaveFailure.bind(this),
                data: {
                    text: text
                }
            });
        }
        this.text = text;
    },
    
    onBlur: function() {
        this.setText(this.$el.text());
    },
    
    onSaveSuccess: function() {
        // nothing
    },

    onSaveFailure: function() {
        elsHelpers.alert(Sky._('Сообщение не удалось сохранить! Пожалуйста, повторите попытку позже.'));
    }
    
});