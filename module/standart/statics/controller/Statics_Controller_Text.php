<?php

namespace module\standart\statics\controller;

class Statics_Controller_Text extends \core\Controller {

    protected $text = '';

    public function init($text = '') {
        $this->text = $text;
    }

    public function content() {
        return '<div class="sky-tinymce-content">'.$this->text.'<div class="sky-clear"></div></div>';
    }

}