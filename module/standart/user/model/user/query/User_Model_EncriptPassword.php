<?php

namespace module\standart\user\model\user\query;

class User_Model_EncriptPassword extends \core\model\Model_Query {

    private $salt_1 = 'ef3wj)giot7bcxz';
    private $salt_2 = 'ewmkuydwq2-=trf';

    public function query($password) {

        return md5($this->salt_1.md5($this->salt_2.$password));

    }
}