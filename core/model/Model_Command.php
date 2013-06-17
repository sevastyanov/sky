<?php

namespace core\model;

abstract class Model_Command extends Model_Abstract {
    abstract public function command($params);
}