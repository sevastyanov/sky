<?php

namespace core;

use \URL_ADMIN;

class Router extends BaseClass {
	
	public function init() {
		
		$path = preg_replace('/\\/?(\?.*)?$/', '', $_SERVER['REQUEST_URI']);

		switch ($path) {
			case '/api':
				$this->runAPI();
				break;
			case URL_ADMIN:
				$this->runAdmin();
				break;
            case URL_ADMIN.'/php_info':

                $this->checkAdminPermissions();

                phpinfo();die;
                break;
			case URL_ADMIN.'/api':
				$this->runAdminAPI();
				break;
			default:

                if (preg_match('/^\/temp\/autosize\/(\d+)x(\d+)_(\w+)%28(.*)%29(\/.+)(\?.*)?$/', $path, $matches)) {

                    $width    = $matches[1];
                    $height   = $matches[2];
                    $method   = $matches[3];
                    $params   = rawurldecode($matches[4]);
                    $fileName = $matches[5];

                    $this->runImageAutoSize($fileName, $width, $height, $method, $params);
                } else {
                    $this->runDefault($path);
                }

				break;
		}
	}

    protected function runImageAutoSize($fileName, $width, $height, $method, $params) {

        $imageCreator = new \core\media\ImageCreator();

        $imageCreator->convertImage($fileName, $width, $height, $method, $params);

    }
	
	protected function runAPI() {
		define('PLATFORM', FRONTEND);

        API::run($this->core);

	}
	
	protected function runDefault($path) {
		define('PLATFORM', FRONTEND);

        /**
         * @var \module\standart\admin\controller\Admin_Controller_Index
         */
        $controller = $this->core->getBootstrap()->getController('page', 'index');

        $controller->init($path);
        $controller->prepare();

        echo $controller->content();
	}
	
	protected function runAdmin() {

        $this->checkAdminPermissions();
		
		define('PLATFORM', BACKEND);
		
		/**
		 * @var \module\standart\admin\controller\Admin_Controller_Index
		 */
		$controller = $this->core->getBootstrap()->getController('admin', 'index');
		
		$controller->init();
		$controller->prepare();
		
		echo $controller->content();
		
	}
	
	protected function runAdminAPI() {

        $this->checkAdminPermissions();

		define('PLATFORM', BACKEND);

        API::run($this->core);
		
	}

    protected function checkAdminPermissions() {

        if ($this->core->getSession()->getUserId() != 1) {
            header('Location: /');
            die;
        }

    }
	
}