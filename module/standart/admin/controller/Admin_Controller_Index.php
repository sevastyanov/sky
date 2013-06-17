<?php

namespace module\standart\admin\controller;

class Admin_Controller_Index extends \core\Controller {
	
	protected $viewClass = '\core\view\PageView';
	
	public function init() {
		
		$head = $this->view->getHead();
		
		$head->BASE_HREF = URL_ADMIN;
		$head->TITLE = 'Панель администрирования';


        $head->addScript('/admin/js/tinymce/tiny_mce_src.js');
		$head->addScript('/admin/js/extjs/ext-all-dev.js');
		$head->addScript('/admin/js/application.js?1');
		
		$head->addStyleSheet('/admin/js/extjs/resources/css/ext-all.css');
        $head->addStyleSheet('/admin/js/extjs/resources/css/data-view.css');

        $body = $this->view->getBody();
        $body->MODULES = json_encode($this->core->getModuleList());
	}
	
	public function prepare() {
	
	}
	
}