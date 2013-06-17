<?php

namespace core\view;

class PageView extends \core\View {

	protected $headView;
	protected $bodyView;
    protected $labelsContents = array();
	
	public function __construct($moduleName) {
		
		parent::__construct($moduleName);
		
		$this->setTemplate('index');
		
		$this->headView = new HeadView($moduleName);
		$this->bodyView = new BodyView($moduleName);
		
	}
	
	public function getHead() {
		return $this->headView;
	}
	
	public function getBody() {
		return $this->bodyView;
	}
	
}