<?php

namespace core\view;

class HeadView extends \core\View {
	
	public $BASE_HREF = '/';
	
	public $TITLE = '';
	public $DESCRIPTION = '';
	public $KEYWORDS = '';
	
	public $SCRIPTS = array();
    public $STYLESHEETS = array();

    public $THEME = null;
	
	public function __construct($moduleName) {
	
		parent::__construct($moduleName);
	
		$this->setTemplate('head');
	
	}
	
	public function addScript($url) {
		$this->SCRIPTS[$url] = NULL;
	}
	
	public function addStyleSheet($url) {
		$this->STYLESHEETS[$url] = NULL;
	}
}