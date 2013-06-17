Ext.define('Ext.ux.form.TinyMCETextAreaWindowManager', {
    extend: 'tinymce.WindowManager',

    control: null,

    //-----------------------------------------------------------------
    constructor: function (cfg) {
        Ext.ux.form.TinyMCETextAreaWindowManager.superclass.constructor.call(this, cfg.editor);
        this.control = cfg.control;
    },
    //-----------------------------------------------------------------
    alert: function (txt, cb, s) {
        Ext.MessageBox.alert(this.editor.getLang("Message", "Message"), this.editor.getLang(txt, txt), function () {
            if (!Ext.isEmpty(cb)) {
                cb.call(this);
            }
        }, s);
    },
    //-----------------------------------------------------------------
    confirm: function (txt, cb, s) {
        Ext.MessageBox.confirm(this.editor.getLang("Question", "Question"), this.editor.getLang(txt, txt), function (btn) {
            if (!Ext.isEmpty(cb)) {
                cb.call(this, btn === "yes");
            }
        }, s);
    },
    //-----------------------------------------------------------------
    setTitle: function (win, ti) {
        var w = Ext.getCmp(win.tinyMCEPopup.id);
        if (w) {
            w.setTitle(ti);
        }
    },
    //-----------------------------------------------------------------
    resizeBy: function (dw, dh, id) {
        var w = Ext.getCmp(id);
        if (!w) {
            return;
        }
        
        // TinyMCE window manager opens the windows in two steps
        //
        // 1. displaying and loading iframe
        // 2. Adjusting the window size to the iframe
        //
        // It has an unbeatufiul eefect of resizing by
        // opening. Thus, we first open the window in the
        // invisible area, and center it only when resize is done.

        var size = w.getSize();
        w.setSize(size.width + dw, size.height + dh);
        w.center();

        var tinypopupIframe = w.getComponent('tiny_popup_iframe');
        if (!tinypopupIframe) { return; }

        var doc = tinypopupIframe.getEl().dom.contentDocument;
        if (!doc) { return; }

        // We do not focus in the standard way. It does not work under IE.
        // The standard focusing occurs too early when using ExtJS windows for the popups.
        // We do focusing here after resize.

        tinymce.each(doc.forms, function (g) {
            tinymce.each(g.elements, function (f) {
                if (tinymce.DOM.hasClass(f, "mceFocus") && !f.disabled) {
                    f.focus();
                    return false;
                }
            });
        });

        // This fixes the bug under IE - after moving the iframe is not visible.
        // But, we have to add this event after a delay, otherwise it removes the
        // focus from the field, what is set above.

        setTimeout(function () {
            w.on('move', function (win, x, y, opts) {
                tinypopupIframe.getEl().focus();
            }, w);
        }, 1500);
    },
    //-----------------------------------------------------------------
    open: function (s, p) {

        var me = this;

        Ext.util.Observable.capture(me.control, function () { return false; });

        // Hide intermediate color popup menu if the more color dialog is displayed.
        // The z-index of the tinymce color popup menu is higher than that of the ExtJS
        // windows, and the menu overlaps the ExtJS window.

        if (me.editor.controlManager.get(me.control.getInputId() + '_forecolor')) {
            me.editor.controlManager.get(me.control.getInputId() + '_forecolor').hideMenu();
        }
        if (me.editor.controlManager.get('mce_fullscreen_forecolor')) {
            me.editor.controlManager.get('mce_fullscreen_forecolor').hideMenu();
        }

        if (me.editor.controlManager.get(me.control.getInputId() + '_backcolor')) {
            me.editor.controlManager.get(me.control.getInputId() + '_backcolor').hideMenu();
        }
        if (me.editor.controlManager.get('mce_fullscreen_backcolor')) {
            me.editor.controlManager.get('mce_fullscreen_backcolor').hideMenu();
        }

        s = s || {};
        p = p || {};

        if (!s.type) {
            me.bookmark = me.editor.selection.getBookmark('simple');
        }

        s.width = parseInt(s.width || 320, 10);
        s.height = parseInt(s.height || 240, 10);
        s.min_width = parseInt(s.min_width || 150, 10);
        s.min_height = parseInt(s.min_height || 100, 10);
        s.max_width = parseInt(s.max_width || 2000, 10);
        s.max_height = parseInt(s.max_height || 2000, 10);
        s.movable = true;
        s.resizable = true;

        p.mce_width = s.width;
        p.mce_height = s.height;
        p.mce_inline = true;

        // We do not focus in the standard way. It does not work under IE.
        // The standard focusing occurs too early when using ExtJS windows for the popups.
        // We do focusing in the resizeBy method
        p.mce_auto_focus = false;

        this.features = s;
        this.params = p;

        this.onOpen.dispatch(this, s, p);

        var win = Ext.create('widget.window', {

            title: s.name,
            width: s.width,
            height: s.height,
            minWidth: s.min_width,
            minHeight: s.min_height,
            resizable: false,
            maximizable: s.maximizable,
            minimizable: s.minimizable,
            modal: true,
            layout: "fit",

            items: [
                Ext.create('Ext.Component', {
                    itemId: 'tiny_popup_iframe',
                    autoEl: {
                        tag: 'iframe',
                        src: s.url || s.file
                    },
                    style: 'border-width: 0px;'
                })
            ],

            listeners: {
                destroy: function (win, opts) {
                    me.onClose.dispatch(me);

                    Ext.util.Observable.releaseCapture(me.control);

                    setTimeout(function () {
                        if (me.editor) {
                            if (!win.closedOverInlineButton && tinymce.isIE) {
                                me.editor.selection.moveToBookmark(me.editor.windowManager.bookmark);
                            }
                            me.editor.focus();
                            
                            me.control.popupActive = false;
                        }
                    }, 300);

                }
            }

        });

        p.mce_window_id = win.getId();

        me.control.popupActive = true;
        
        win.show(null,
            function () {
                // TinyMCE window manager opens the windows in two steps
                //
                // 1. displaying and loading iframe
                // 2. Adjusting the window size to the iframe
                //
                // It has an unbeatufiul eefect of resizing after
                // opening. Thus, we first open the window in the
                // invisible area, and center it only when resize is done.

                win.setPagePosition(-900, -900);
            },
            me
        );

        return win;
    },
    //-----------------------------------------------------------------
    close: function (win) {

        var me = this;
        
        if (!win || !win.tinyMCEPopup || !win.tinyMCEPopup.id) { return; }

        var w = Ext.getCmp(win.tinyMCEPopup.id);
        if (w) {
            w.closedOverInlineButton = true;
            w.close();
        }
    }
    //-----------------------------------------------------------------
});