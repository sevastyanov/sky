<?php

namespace core;

class Model extends BaseClass {
	
	protected $moduleName;
    protected $enteties = array();
	
	public function __construct($moduleName) {
		
		$this->moduleName = $moduleName;
		
	}

    /**
     * @param $entetyName
     * @return ModelEntety
     */
    public function getEntety($entetyName) {
        if (!isset($this->enteties[$entetyName])) {
            $this->enteties[$entetyName] = new ModelEntety($this->moduleName, $entetyName, $this);
        }
        return $this->enteties[$entetyName];
    }

}