<?php

namespace core;

class Controller extends BaseClass {
	
	protected $moduleName;
	protected $action;
	protected $viewClass = '\core\View';
	/**
	 * @var \core\View
	 */
	protected $view;
	
	public function __construct($moduleName, $action) {
		
		parent::__construct();
		
		$this->moduleName = $moduleName;
		$this->action     = $action;
		
		$this->view = new $this->viewClass('/module/'.$this->moduleName);
		
	}

    public function getModuleName() {
        return $this->moduleName;
    }

    public function getAction() {
        return $this->action;
    }

    public function getNoWrap() {
        return false;
    }
	
	public function init($params = array()) {
		
	}
	
	public function prepare() {
		
	}
	
	public function content() {
		return $this->view->render();
	}

    protected function getModel($moduleName = false) {
        if (!$moduleName) {
            $moduleName = $this->moduleName;
        }
        return $this->core->getModel($moduleName);
    }
	
}