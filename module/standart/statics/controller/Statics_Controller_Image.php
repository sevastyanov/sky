<?php

namespace module\standart\statics\controller;

class Statics_Controller_Image extends \core\Controller {

    protected $link = '';

    public function init($link = '') {
        $this->link = $link;
    }

    public function content() {
        return $this->link;
    }

    public function getNoWrap() {
        return true;
    }
}