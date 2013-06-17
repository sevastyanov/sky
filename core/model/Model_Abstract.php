<?php

namespace core\model;

abstract class Model_Abstract extends  \core\BaseClass {

    /**
     * @var \core\ModelEntety
     */
    protected $entety;

    public function __construct($entety) {
        $this->entety = $entety;

        parent::__construct();
    }

}