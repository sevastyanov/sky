<?php

namespace core\model;

abstract class Model_Query extends Model_Abstract {
    abstract public function query($params);
}