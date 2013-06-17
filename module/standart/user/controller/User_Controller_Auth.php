<?php

namespace module\standart\user\controller;

class User_Controller_Auth extends \core\Controller {

    protected static function getId() {
        static $id = 0;
        return 'sky-auth-'.$id++;
    }

    public function init($data) {

        $userInfo = $this->core->getUser()->getInfo();

        if (!$userInfo) {
            $this->view->ID = self::getId();
            $this->view->FB = array(
                'client_id' => '512930385426937',
                'redirect_uri' => 'http://'.$_SERVER['HTTP_HOST'].'/api/?api_module=user&api_action=Auth_Facebook'
            );
        } else {
            $this->view->user = $userInfo;
        }

        $this->view->setTemplate('auth');
    }
}