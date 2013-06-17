Sky.define('sky.module.user.Auth', {

    config: {
        containerId: null,
        fb: null
    },

    __construct: function(cfg) {

        this.$el = $('#' + this.containerId);
        this.$linkFb = $('#' + this.containerId + '-fb');
        this.$linkFb.on('click', this.onClick_fb.bind(this));

    },

    onClick_fb: function(e) {

        e.preventDefault();

        var url = 'https://www.facebook.com/dialog/oauth'
                    + '?client_id=' + this.fb.client_id
                    + '&redirect_uri=' + encodeURIComponent(this.fb.redirect_uri);

        var $fbIframe = $('<iframe src="' + url + '"></iframe>');

        $fbIframe.css({
            width: '500px',
            height: '350px'
        });

        $dialog = $('<div></div>');
        $dialog.append($fbIframe);

        $dialog.dialog({
            title: Sky._('Авторизация через Facebook'),
            autoOpen: true,
            resizable: false,
            height: 430,
            width: 530,
            modal: true
        });

        this.$dialog = $dialog;

        $(window).on('fb_auth_success', this.onOAuth_success.bind(this));

    },

    onOAuth_success: function() {
        this.$dialog.dialog('close');
        window.location = window.location;
    }

});