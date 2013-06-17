<?php

namespace core;

class Core {
	
	private static $instance;
	
	/**
	 * 
	 * @var Router
	 */
	private $router;
	
	/**
	 * 
	 * @var Bootstrap
	 */
	private $bootstrap;

    /**
     * @var Session
     */
    private $session;
    /**
     * @var User
     */
    private $user;

    public function getSession() {
        return $this->session;
    }

    public function getUser() {
        return $this->user;
    }
	
	public function getRouter() {
		return $this->router;
	}
	
	public function getBootstrap() {
		return $this->bootstrap;
	}

    protected $models = array();

    /**
     * @param $moduleName
     * @return Model
     */
    public function getModel($moduleName) {
        if (!isset($this->models[$moduleName])) {
            $this->models[$moduleName] = new Model($moduleName);
        }
        return $this->models[$moduleName];
    }
	
	public static function get() {
		
		return self::$instance;
		
	}

    protected $design = 'standart';

    public function getDesign() {
        return $this->design;
    }

    protected $templates;

    public function getTemplates() {

        if (!$this->templates) {
            $fn = function($fileName) {
                include $fileName;
                return $templates;
            };

            $this->templates = $fn(DIR_ROOT.'/view/'.$this->design.'/templates.php');
        }

        return $this->templates;
    }

    /**
     * @var \PDO
     */
    public $db;

    protected $modules;

    public function getModuleList() {
        return $this->modules;
    }
	
	public function __construct() {
		
		if (self::$instance) {
			throw new \Exception('Ядро уже было загружено ранее');
		}
		
		self::$instance = $this;

        $moduleListFileName = DIR_ROOT.'/settings/modules.php';

        $fn = function($moduleListFileName) {
            include_once $moduleListFileName;
            return $modules;
        };

        $this->modules = $fn($moduleListFileName);
		
		define('URL_ADMIN',  '/admin');
		define('SQL_DRIVER', 'mysql');
		define('MODULE_DEFAULT', 'standart');
		define('MODULE_EXTEND',  'standart');
		define('DIR_MODULE_DEFAULT', DIR_ROOT.'/module/'.MODULE_DEFAULT);
		define('DIR_MODULE_EXTEND',  DIR_ROOT.'/module/'.MODULE_EXTEND);
        define('URL_UPLOAD',  '/upload');
        define('DIR_UPLOAD', DIR_PUBLIC.'/upload');

		$bootstrapFileName = DIR_ROOT.'/core/Bootstrap.php';
		
		$fn = function() use ($bootstrapFileName) {
			include_once $bootstrapFileName;
		};
		
		$fn();

        $dbOptions = array(
            \PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
        );

        $this->db = new \PDO('mysql:dbname=sky;host=192.168.1.4', 'cyril', '1234567', $dbOptions);
        $this->db->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
		
		$this->bootstrap = new Bootstrap();
		
		spl_autoload_register(array($this->bootstrap, 'autoload'));

        $this->session = new Session();
        $this->user    = new User();

		$this->router = new Router();
		$this->router->init();
	}
	
}