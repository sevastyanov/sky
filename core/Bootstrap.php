<?php

namespace core;

class Bootstrap {
	
	public function autoload($className) {
		
		$fileName = DIR_ROOT.'/'.str_replace('\\', '/', $className).'.php';
		
		$fn = function() use ($fileName) {
			include $fileName;
		};
		
		$fn();
		
	}
		
	protected $moduleClasses = array();
	
	public function getModuleRealClassName($moduleClassName) {
		
		if (!empty($this->moduleClasses[$moduleClassName])) {
			return $this->moduleClasses[$moduleClassName];
		}
		
		$fileNameEndPart = str_replace('\\', '/', $moduleClassName).'.php';
		
		$className = '\\module\\'.MODULE_EXTEND.$moduleClassName;
		$testFile = DIR_MODULE_EXTEND.$fileNameEndPart;
		
		if (file_exists($testFile)) {
			$this->moduleClasses[$moduleClassName] = $className;
			return $className;
		}
		
		$className = '\\module\\'.MODULE_DEFAULT.$moduleClassName;
		$testFile = DIR_MODULE_DEFAULT.$fileNameEndPart;
		
		if (file_exists($testFile)) {
			$this->moduleClasses[$moduleClassName] = $className;
			return $className;
		}
		
		throw new \Exception('Не удалось найти реальный класс для класса модуля '.$moduleClassName);
	}
	
	protected $queries = array();
	
	public function getQuery($moduleName, $entetyName, $entetyMethod, $entety) {
		
		if (empty($this->queries[$moduleName])) {
			$this->queries[$moduleName] = array();
		}

        if (empty($this->queries[$moduleName][$entetyName])) {
            $this->queries[$moduleName][$entetyName] = array();
        }
		
		if (empty($this->queries[$moduleName][$entetyName][$entetyMethod])) {
			$className = $this->getModuleRealClassName('\\'.$moduleName.'\\model\\'.$entetyName.'\\query\\'.self::toCamelCase($entetyName).'_Model_'.self::toCamelCase($entetyMethod));
			$this->queries[$moduleName][$entetyName][$entetyMethod] = new $className($entety);
		}
		
		return $this->queries[$moduleName][$entetyName][$entetyMethod];
	}
	
	protected $commands = array();

    protected static function toCamelCase($name) {
        $parts = explode('_', $name);
        foreach ($parts as &$part) {
            $part = ucfirst($part);
        }
        return implode('', $parts);
    }
	
	public function getCommand($moduleName, $entetyName, $entetyMethod, $entety) {
		
		if (empty($this->commands[$moduleName])) {
			$this->commands[$moduleName] = array();
		}

        if (empty($this->commands[$moduleName][$entetyName])) {
            $this->commands[$moduleName][$entetyName] = array();
        }
		
		if (empty($this->commands[$moduleName][$entetyName][$entetyMethod])) {
			$className = $this->getModuleRealClassName('\\'.$moduleName.'\\model\\'.$entetyName.'\\command\\'.self::toCamelCase($entetyName).'_Model_'.self::toCamelCase($entetyMethod));
			$this->commands[$moduleName][$entetyName][$entetyMethod] = new $className($entety);
		}
		
		return $this->commands[$moduleName][$entetyName][$entetyMethod];
	}
	
	public function getController($moduleName, $action) {
		
		$moduleClassName = '\\'.$moduleName.'\\controller\\'.ucfirst($moduleName).'_Controller_'.ucfirst($action);
		$className = $this->getModuleRealClassName($moduleClassName);
		
		return new $className($moduleName, $action);
		
	}

    protected $api = array();

    public function getAPI($moduleName, $actionName) {

        if (empty($this->api[$moduleName])) {
            $this->api[$moduleName] = array();
        }

        if (empty($this->api[$moduleName][$actionName])) {
            $className = $this->getModuleRealClassName('\\'.$moduleName.'\\api\\'.PLATFORM.'\\'.ucfirst($moduleName).'_API_'.$actionName);
            $this->api[$moduleName][$actionName] = new $className();
        }

        return $this->api[$moduleName][$actionName];
    }
}