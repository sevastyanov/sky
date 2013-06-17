<?php

namespace core;

class BaseClass {
	
	/**
	 * Ядро приложения
	 * @var Core
	 */
	protected $core;
	
	public function __construct() {
		
		$this->core = Core::get();
		
	}

    protected function getDb() {
        return $this->core->db;
    }
	
}