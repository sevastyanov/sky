<?php

namespace core;

class ModelEntety extends BaseClass {
	
	protected $moduleName;
    protected $entetyName;
    protected $queryMethods = array();
    protected $commandMethods = array();
    protected $bootstrap = array();
    /**
     * @var Model
     */
    protected $model;
	
	public function __construct($moduleName, $entetyName, $model) {

        parent::__construct();

        $this->model      = $model;
		$this->moduleName = $moduleName;
        $this->entetyName = $entetyName;
        $this->bootstrap  = $this->core->getBootstrap();
		
	}

    public function query($methodName, $params = array()) {

        $methods = &$this->queryMethods;

        if (!isset($methods[$methodName])) {
            $methods[$methodName] = $this->bootstrap->getQuery($this->moduleName, $this->entetyName, $methodName, $this);
        }
        return $methods[$methodName]->query($params);
    }

    public function command($methodName, $params = array()) {

        $methods = &$this->commandMethods;

        if (!isset($methods[$methodName])) {
            $methods[$methodName] = $this->bootstrap->getCommand($this->moduleName, $this->entetyName, $methodName, $this);
        }
        return $methods[$methodName]->command($params);
    }

}