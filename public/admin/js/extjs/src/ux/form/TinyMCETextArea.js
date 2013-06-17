Ext.define('Ext.ux.form.TinyMCETextArea', {

    extend: 'Ext.form.field.TextArea',
    alias: ['widget.tinymce_textarea', 'widget.tinymce_field'],

    //-----------------------------------------------------------------

    /*
     Flag for tracking the initialization state
     */
    wysiwygIntialized: false,
    intializationInProgress: false,
    popupActive: false,
    lastWidth: 0,
    lastHeight: 0,
    positionBeforeBlur: null,
    storedCursorPosition: null,

    /*
     This properties enables starting without WYSIWYG editor.
     The user can activate it later if he wants.
     */
    noWysiwyg: false,

    /*
     Config object for the TinyMCE configuration options
     */
    tinyMCEConfig: {},

    //-----------------------------------------------------------------
    afterRender: function () {
        var me = this;

        me.callParent(arguments);

        // If an element is a child of an invisible container like tab,
        // there are a number of issues which make the life complicated:
        //
        // - The element might not be completely rendered; it will be
        //   completely rendered only when the container becomes visible.
        // - The size of the element might be unknown until the container becomes
        //   visible. If you do size adjustment, while the container is
        //   not visible, the size might be calculated and set incorrectly.
        // - No show/hide event is fired for the element self if the container
        //   becomes visible or hidden. The event is fired only for that parent
        //   container, which is being actively shown or hidden.
        // - You have to attach the event handler to the correct parent container
        //   and do size adjustment only if the container becomes visible.
        //
        // We check whether our TinyMCETextArea is a child of a tab panel. If yes,
        // we attach the event handler to the tab change event and do
        // size adjustment if the parent tab, which contains our TinyMCETextArea,
        // becomes visible.
        //
        // PS: It will not work if you have a tab control within another tab control!

        var tabpanel = me.findParentByType('tabpanel');
        if (tabpanel) {
            tabpanel.on('tabchange', function (tabPanel, newCard, oldCard, eOpts) {

                var myCard = me.findParentBy(function (cont, elm) {
                    return cont.getId() === newCard.getId();
                });
                if (myCard) {
                    me.syncEditorSize(me.lastWidth, me.lastHeight);
                }
            }, me);
        }

        me.on('blur', function (elm, ev, eOpts) {

            var ctrl = document.getElementById(me.getInputId());

            if (me.wysiwygIntialized) {
                var ed = tinymce.get(me.getInputId());

                // In the HTML text modus, the contents should be
                // synchronized upon the blur event.
                if (ed && ed.isHidden()) {
                    if (ctrl) {
                        me.positionBeforeBlur = { start: ctrl.selectionStart, end: ctrl.selectionEnd };
                    }

                    ed.load();
                }
            }
            else {
                if (ctrl) {
                    me.positionBeforeBlur = { start: ctrl.selectionStart, end: ctrl.selectionEnd };
                }
            }
        }, me);

        me.on('resize', function (elm, width, height, oldWidth, oldHeight, eOpts) {
            /*
             alert('width:' + width + '\n' +
             'height:' + height + '\n' +
             'oldWidth:' + oldWidth + '\n' +
             'oldHeight:' + oldHeight
             );
             */

            if (elm.hasVisibleLabel() && (elm.labelAlign === 'left' || elm.labelAlign === 'right')) {
                width = width - (elm.labelWidth + elm.labelPad);
            }

            me.lastWidth = width;
            me.lastHeight = height;

            if (!me.noWysiwyg && !me.wysiwygIntialized) {
                me.initEditor();
            }
            else {
                me.syncEditorSize(me.lastWidth, me.lastHeight);
            }
        }, me);
    },
    //-----------------------------------------------------------------
    getWidthCorrection: function () {
        var me = this;

        var widthCorrection = 0;
        if (Ext.isGecko) { widthCorrection = -2; }
        if (Ext.isOpera) { widthCorrection = -2; }
        if (Ext.isIE) { widthCorrection = -2; }

        return widthCorrection;
    },
    //-----------------------------------------------------------------
    syncEditorSize: function (w, h) {
        var me = this;

        if (!me.wysiwygIntialized || !me.rendered) { return; }

        var ed = tinymce.get(me.getInputId());

        // if the editor is hidden, we do not syncronize
        // because the size values of the hidden editor
        // are calculated wrong.

        if (ed.isHidden()) { return; }

        // Unfortunately, the TinyMCE has no setSize method
        // This method would help enormly and make the integration
        // very easy.
        //
        // So, we have to deal with internal issues of the editor.
        // We get the height of the tool bar and the status bar and
        // calculate the height of the content frame.

        var edTable = Ext.get(me.getInputId() + "_tbl");
        var edIframe = Ext.get(me.getInputId() + "_ifr");

        var edToolbar = edTable.down(".mceToolbar");
        var edStatusbar = edTable.down(".mceStatusbar");

        var frameHeight = h - 2;

        if (edToolbar) { frameHeight -= edToolbar.getHeight(); }
        if (edStatusbar) { frameHeight -= edStatusbar.getHeight(); }

        edIframe.setHeight(frameHeight);

        edTable.setWidth(w + me.getWidthCorrection());
        edTable.setHeight(h);
    },
    //-----------------------------------------------------------------
    initEditor: function () {
        var me = this;

        if (me.noWysiwyg || me.intializationInProgress || me.wysiwygIntialized) { return; }

        me.intializationInProgress = true;

        if (!me.tinyMCEConfig) {
            me.tinyMCEConfig = {};
        }
        else {
            // We need clone, not reference.
            // The configuration of the wysiwyg might be passed as an object to
            // many editor instances. Through cloning, we prevent
            // side effects on other editors upon internal modifications
            // of the tinyMCEConfig
            var tmp_cfg = me.tinyMCEConfig;
            me.tinyMCEConfig = {};
            Ext.Object.merge(me.tinyMCEConfig, tmp_cfg);
        }

        me.tinyMCEConfig.mode = "exact";
        me.tinyMCEConfig.elements = me.getInputId();

        // This type of resizing s very harmful by integration with ExtJS.
        // The editor should occupy only the place given to it by the
        // layout manager.
        me.tinyMCEConfig.theme_advanced_resizing = false;

        // we pass the height and width explicitly to the editor
        me.tinyMCEConfig.width = me.lastWidth + me.getWidthCorrection();
        me.tinyMCEConfig.height = me.lastHeight;

        if (me.readOnly) {
            me.tinyMCEConfig.readonly = true;
            me.tinyMCEConfig.height -= 3;
        }

        if (me.labelEl) {
            me.labelEl.on('click', function (ev, elm, opts) {
                me.focus(false);
            }, me.labelEl);
        }

        var user_setup = null;
        var user_onchange_callback = null;

        if (me.tinyMCEConfig.setup) { user_setup = me.tinyMCEConfig.setup; }
        if (me.tinyMCEConfig.onchange_callback) { user_onchange_callback = me.tinyMCEConfig.onchange_callback; }

        me.tinyMCEConfig.onchange_callback = function (ed) {

            // косяк в tinymce, приходится обрабатывать асинхронно

            setTimeout(function() {
                var oldval = me.getValue();
                var newval = ed.getContent();

                ed.save();

                me.fireEvent('change', me, newval, oldval, {});

                if (me.validateOnChange) {
                    me.validate();
                }

                if (user_onchange_callback) { user_onchange_callback(ed); }
            }, 0);
        };

        me.tinyMCEConfig.setup = function (ed) {

            ed.onExecCommand.add(function (ed, cmd, ui, val) {

                if (cmd !== 'mceFullScreen') { return; }

                var fullscreen_container = document.getElementById("mce_fullscreen_container");
                if (!fullscreen_container) { return; }

                fullscreen_container.style.zIndex = Ext.ZIndexManager.zBase + 2;

                var fullscreen_ed = tinyMCE.get(ed.getParam('fullscreen_editor_id'));
                if (fullscreen_ed) {
                    fullscreen_ed.windowManager = Ext.create('Ext.ux.form.TinyMCETextAreaWindowManager', {
                        control: me,
                        editor: fullscreen_ed
                    });
                }
            });

            ed.onInit.add(function (ed) {
                me.wysiwygIntialized = true;
                me.intializationInProgress = false;

                if (me.isDisabled()) { me.disableEditor(); }

                tinymce.dom.Event.add(ed.getWin(), 'focus', function (e) {
                    var w = me.findParentByType('window');
                    if (w && !me.popupActive) {
                      // we use toFront to bring the parent window
                      // to the front when the editor gets focus.
                      // Under IE10, the editor gets focus, even if
                      // a popup like image insert is opened. This is 
                      // bad, because the popup goes into the back, and 
                      // the editor to the front.
                      //
                      // We have introduced the flag 'popupActive',
                      // which is set when the popup is opened and unset 
                      // when the popup is closed.
                      //
                      // We do not do toFront id the popup is active.
                      
                      w.toFront(true);
                    }
                });
            });

            ed.onPostRender.add(function (ed, controlManager) {
                ed.windowManager = Ext.create('Ext.ux.form.TinyMCETextAreaWindowManager', {
                    control: me,
                    editor: ed
                });
            });

            if (user_setup) { user_setup(ed); }
        };

        if (!tinymce.dom.Event.domLoaded) {
            tinymce.dom.Event.domLoaded = true;
        }

        tinymce.init(me.tinyMCEConfig);
    },
    //-----------------------------------------------------------------
    getEditor: function () {
        var me = this;

        if (!me.wysiwygIntialized) {
            return null;
        }

        return tinymce.get(me.getInputId());
    },
    //-----------------------------------------------------------------
    isEditorHidden: function () {
        var me = this;

        if (!me.wysiwygIntialized) { return true; }

        var ed = tinymce.get(me.getInputId());
        if (!ed) { return true; }

        return ed.isHidden();
    },
    //-----------------------------------------------------------------
    showEditor: function () {
        var me = this;

        me.storedCursorPosition = null;

        if (!me.wysiwygIntialized) {
            me.noWysiwyg = false;
            me.initEditor();
            return;
        }

        var ed = tinymce.get(me.getInputId());

        if (ed) {
            ed.show();

            ed.nodeChanged();
            me.syncEditorSize(me.lastWidth, me.lastHeight);
            me.focus();
        }
    },
    //-----------------------------------------------------------------
    hideEditor: function () {
        var me = this;

        if (!me.wysiwygIntialized) { return; }

        var ed = tinymce.get(me.getInputId());
        if (!ed) { return; }

        var node = ed.selection.getNode();

        me.storedCursorPosition = null;

        // no selection, just hide

        if (!node || node.nodeName === "#document" || node.nodeName === "BODY" || node.nodeName === "body") {
            ed.hide();

            return;
        }

        // otherwise try to position the cursor

        var marker = '<a id="_____sys__11223___"></a>';
        ed.selection.collapse(true);
        ed.execCommand('mceInsertContent', 0, marker);

        ed.hide();

        var ctrl = document.getElementById(me.getInputId());

        var pos = -1;
        var txt = "";

        if (ctrl) {
            txt = ctrl.value;
            pos = txt.indexOf(marker);
        }

        if (pos !== -1) {
            var re = new RegExp(marker, "g");
            txt = txt.replace(re, "");
            ctrl.value = txt;

            if (ctrl.setSelectionRange) {
                ctrl.focus();
                ctrl.setSelectionRange(pos, pos);
            }
        }
    },
    //-----------------------------------------------------------------
    toggleEditor: function () {
        var me = this;

        if (!me.wysiwygIntialized) {
            me.showEditor();
            return;
        }

        var ed = tinymce.get(me.getInputId());

        if (ed.isHidden()) {
            me.showEditor();
        }
        else {
            me.hideEditor();
        }

    },
    //-----------------------------------------------------------------
    removeEditor: function () {
        var me = this;

        if (me.intializationInProgress) {return me; }

        if (!me.wysiwygIntialized) { return me; }

        var ed = tinymce.get(me.getInputId());
        if (ed) {
            ed.save();
        }

        tinyMCE.execCommand('mceRemoveControl', false, me.getInputId());

        me.wysiwygIntialized = false;

        return me;
    }, //removeEditor
    //-----------------------------------------------------------------
    // Sometimes, the editor should be reinitilized on the fly, e.g.
    // if the body css has been changed (in a CMS the user changed
    // the design template of a page opened in the editor).
    // This method removes the editor from the textarea, adds the
    // changed properties to the base config object and initializes
    // the editor again.
    //-----------------------------------------------------------------
    reinitEditor: function (cfg) {
        var me = this;

        if (me.noWysiwyg || me.intializationInProgress) { return me; }

        if (!me.tinyMCEConfig) { me.tinyMCEConfig = {}; }
        if (!cfg) { cfg = {}; }


        Ext.apply(me.tinyMCEConfig, cfg);

        if (!me.wysiwygIntialized) { return me; }

        var hidden = true;

        var ed = tinymce.get(me.getInputId());
        if (ed) {
            hidden = ed.isHidden();
            ed.save();
        }

        tinyMCE.execCommand('mceRemoveControl', false, me.getInputId());

        me.wysiwygIntialized = false;

        if (!hidden) { me.initEditor(); }

        return me;
    },
    //-----------------------------------------------------------------
    setValue: function (v) {
        var me = this;

        var res = me.callParent(arguments);

        if (me.wysiwygIntialized) {
            // The editor does some preformatting of the HTML text
            // entered by the user.
            // The method setValue sets the value of the textarea.
            // We have to load the text into editor for the
            // preformatting and then to save it back to the textarea.

            var ed = tinymce.get(me.getInputId());
            if (ed) {
                ed.load();
                ed.save();
            }
        }

        return res;
    },
    //-----------------------------------------------------------------
    enableEditorControls: function (state) {
        var me = this;
        var ed = tinymce.get(me.getInputId());
        if (!ed) { return; }

        tinymce.each(ed.controlManager.controls, function (c) {
            c.setDisabled(!state);
        });
    },
    //-----------------------------------------------------------------
    enable: function (silent) {
        var me = this;

        if (!me.isDisabled()) { return; }

        var ed = tinymce.get(me.getInputId());
        if (ed) {
            // We restore contentEditable to true

            var edIframe = Ext.get(me.getInputId() + "_ifr");
            edIframe.dom.contentDocument.body.contentEditable = true;

            // We have luck, because there is this useful internal method
            // to add all events unbound in the disable command
            ed.bindNativeEvents();

            me.enableEditorControls(true);

            // The call above enables ALL tollbar buttons
            // It is wrong. We fire this event to force adjusting
            // of the enabled/disabled state of the buttons to the
            // actual state of the editor.

            ed.nodeChanged();
        }

        return me.callParent(arguments);
    },
    //-----------------------------------------------------------------
    disableEditor: function () {
        var me = this;

        var ed = tinymce.get(me.getInputId());
        if (ed) {
            // The body cannot be disabled,
            // So we remove events from the

            tinymce.dom.Event.clear(ed.getBody());
            tinymce.dom.Event.clear(ed.getWin());
            tinymce.dom.Event.clear(ed.getDoc());
            tinymce.dom.Event.clear(ed.formElement);

            ed.onExecCommand.listeners = [];

            // We set the contentEditable to false
            var edIframe = Ext.get(me.getInputId() + "_ifr");
            edIframe.dom.contentDocument.body.contentEditable = false;

            // We disable all tool bar controls
            me.enableEditorControls(false);
        }
    }, // disableEditor
    //-----------------------------------------------------------------
    disable: function (silent) {
        var me = this;

        if (me.isDisabled()) { return; }

        me.disableEditor();

        return me.callParent(arguments);
    },
    //-----------------------------------------------------------------
    setReadOnly: function (readOnly) {
        var me = this;

        var result = me.callParent(arguments);

        if (readOnly !== me.tinyMCEConfig.readonly) {
            me.reinitEditor({
                readonly: readOnly
            });

            me.syncEditorSize(me.lastWidth, me.lastHeight);
        }

        return result;
    }, // setReadOnly
    //-----------------------------------------------------------------
    focus: function (selectText, delay) {
        var me = this;

        if (me.isDisabled()) { return me; }

        if (delay) {
            if (isNaN(delay)) { delay = 10; }

            setTimeout(function () {
                me.focus.call(me, selectText, false);
            }, delay);
            return me;
        }

        if (!me.wysiwygIntialized) {
            return me.callParent(arguments);
        }

        var ed = tinymce.get(me.getInputId());

        if (ed && !ed.isHidden()) {
            me.callParent(arguments);

            ed.focus();
        }
        else {
            return me.callParent(arguments);
        }

        return me;
    },
    //-----------------------------------------------------------------
    storeCurrentSelection: function () {
        var me = this;

        var wwg_mode = false;

        var ed = tinymce.get(me.getInputId());

        if (me.wysiwygIntialized) {
            if (ed && !ed.isHidden()) { wwg_mode = true;}
        }

        var ctrl = document.getElementById(me.getInputId());

        if (wwg_mode) {
            me.storedCursorPosition = ed.selection.getBookmark('simple');
        }
        else if (ctrl) {
            me.storedCursorPosition = me.positionBeforeBlur;
        }
    }, // storeCurrentSelection
    //-----------------------------------------------------------------
    restoreCurrentSelection: function () {
        var me = this;

        if (!me.storedCursorPosition) {
            return;
        }

        var wwg_mode = false;

        var ed = tinymce.get(me.getInputId());

        if (me.wysiwygIntialized) {
            if (ed && !ed.isHidden()) {
                wwg_mode = true;
            }
        }

        var ctrl = document.getElementById(me.getInputId());

        if (wwg_mode) {
            ed.selection.moveToBookmark(me.storedCursorPosition);
        }
        else if (ctrl) {
            ctrl.setSelectionRange(me.storedCursorPosition.start, me.storedCursorPosition.end);
        }
    }, // restoreCurrentSelection
    //-----------------------------------------------------------------
    insertText: function (txt) {
        var me = this;

        var wwg_mode = false;

        var ed = tinymce.get(me.getInputId());

        if (me.wysiwygIntialized) {
            if (ed && !ed.isHidden()) {
                wwg_mode = true;
            }
        }

        var ctrl = document.getElementById(me.getInputId());

        if (wwg_mode) {
            ed.focus();
            ed.execCommand('mceInsertContent', 0, txt);
        }
        else if (ctrl) {
            ctrl.focus();

            var start = ctrl.selectionStart + txt.length;

            ctrl.value = ctrl.value.slice(0, ctrl.selectionStart) + txt + ctrl.value.slice(ctrl.selectionEnd);

            ctrl.setSelectionRange(start, start);
        }
    }, // insertText
    //-----------------------------------------------------------------
    beforeDestroy: function () {
        var me = this;
        tinyMCE.execCommand('mceRemoveControl', false, me.getInputId());
    },
    //-----------------------------------------------------------------
    renderActiveError: function () {

        var me = this,
            activeError = me.getActiveError(),
            hasError = !!activeError;

        var edTable = Ext.get(me.getInputId() + "_tbl");
        var edIframe = Ext.get(me.getInputId() + "_ifr");

        if (!edTable) { return me.callParent(arguments); }

        /*
         Adding the red border to the mceIframeContainer is the most sure
         way to do it without harming sizing and positioning.
         */
        var edFrameContainer = edTable.down(".mceIframeContainer");

        if (edFrameContainer && me.rendered && !me.isDestroyed && !me.preventMark) {
            var ed = tinymce.get(me.getInputId());

            var evHandler = function (ed, e) {
                me.clearInvalid();
            };

            // Add/remove invalid class
            if (hasError) {
                edFrameContainer.addCls('tinymce-error-field');

                // this dirty hack is required for WebKit browsers - Safari and Chrome
                edIframe.setHeight(edIframe.getHeight() - 1);
                edIframe.setHeight(edIframe.getHeight() + 1);

                if (ed) {
                    // the invalid mark should be removed after any
                    // change of the contents (ExtJS standard behaviour)
                    ed.onKeyDown.add(evHandler);
                }
            }
            else {
                edFrameContainer.removeCls('tinymce-error-field');

                // this dirty hack is required for WebKit browsers - Safari and Chrome
                edIframe.setHeight(edIframe.getHeight() - 1);
                edIframe.setHeight(edIframe.getHeight() + 1);

                if (ed) {
                    ed.onKeyDown.remove(evHandler);
                    ed.onChange.remove(evHandler);
                }
            }
        }

        return me.callParent(arguments);
    }
    //-----------------------------------------------------------------
});