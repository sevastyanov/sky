<?php

namespace core;

class View extends BaseClass {
	
	protected $moduleName;
	protected $templateFileName;
	
	public function __construct($moduleName) {
		
		$this->moduleName = $moduleName;
		
	}
	
	protected static $templates = array();
	
	public function setTemplate($templateFileName) {
		
		$templateFileName .= '.phtml';
		
		if (!isset(static::$templates[$this->moduleName])) {
			static::$templates[$this->moduleName] = array();
		}
		
		if (!isset(static::$templates[$this->moduleName][$templateFileName])) {
			
			$viewPath = DIR_ROOT.'/view';
			$tplFileName = $viewPath.'/'.MODULE_EXTEND.'/'.$this->moduleName.'/tpl/'.$templateFileName;
			
			if (!file_exists($tplFileName)) {
				$tplFileName = $viewPath.'/'.MODULE_DEFAULT.'/'.$this->moduleName.'/tpl/'.$templateFileName;
				
				if (!file_exists($tplFileName)) {
					
				} else {
					throw new \Exception('Не удалось найти шаблон '.$templateFileName.' для модуля '.$this->moduleName);
				}
			}
			
			static::$templates[$this->moduleName][$templateFileName] = $tplFileName;
			
		}
		
		$this->templateFileName = static::$templates[$this->moduleName][$templateFileName];
	}
		
	public function render() {
		
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
}