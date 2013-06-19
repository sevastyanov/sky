<?php

namespace core;

class View extends BaseClass {
	
	protected $baseViewPath;
	protected $templateFileName;
	
	public function __construct($baseViewPath) {
		
		$this->baseViewPath = $baseViewPath;
		
	}
	
	protected static $templates = array();
	
	public function setTemplate($templateFileName) {
		
		$templateFileName .= '.phtml';
		
		if (!isset(static::$templates[$this->baseViewPath])) {
			static::$templates[$this->baseViewPath] = array();
		}
		
		if (!isset(static::$templates[$this->baseViewPath][$templateFileName])) {
			
			$viewPath = DIR_ROOT.'/view';
			$tplFileName = $viewPath.'/'.MODULE_EXTEND.$this->baseViewPath.'/tpl/'.$templateFileName;
			
			if (!file_exists($tplFileName)) {
				$tplFileName = $viewPath.'/'.MODULE_DEFAULT.$this->baseViewPath.'/tpl/'.$templateFileName;
				
				if (!file_exists($tplFileName)) {
                    $tplFileName = false;
				}
			}
			
			static::$templates[$this->baseViewPath][$templateFileName] = $tplFileName;
			
		}
		
		$this->templateFileName = static::$templates[$this->baseViewPath][$templateFileName];
	}
		
	public function render() {

        if (!$this->templateFileName) {
            return '';
        }

		$fn = function($V, $FILENAME) {
			include $FILENAME;
		};
		
		ob_start();
		
		$fn($this, $this->templateFileName);
		
		$out = ob_get_contents();
		ob_end_clean();
		
		return $out;
	}

    public function tinyMceText($text) {
        return '<div class="sky-tinymce-content">'.$text.'</div>';
    }

    public function __call($method, $arguments) {

        static $helpers = array();
        if (empty($helpers[$method])) {

            $helperClassName = '\\core\\view\\helper\\'.ucfirst($method).'Helper';

            if (!class_exists($helperClassName)) {
                throw new \Exception('Не удалось найти помощник вида '.$method);
            }

            $helpers[$method] = $helperClassName;
        }

        $helperClassName = $helpers[$method];

        $helper = new $helperClassName('/helper');

        call_user_func_array(array($helper, $method), $arguments);

        return $helper->render();
    }
}