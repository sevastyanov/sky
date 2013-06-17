<?php

namespace module\standart\statics\controller;

class Statics_Controller_H1 extends \core\Controller {

    protected $text = '';

    public function init($text = '') {
        $this->text = $text;
    }

    public function content() {
        return '<h1>'.$this->text.'</h1>';
    }

    public function getNoWrap() {
        return true;
    }
}