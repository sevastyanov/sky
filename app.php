<?php

const FRONTEND = 'frontend';
const BACKEND  = 'backend';

define('DIR_ROOT', __DIR__);
define('DIR_PUBLIC', DIR_ROOT.'/public');

include_once 'core/Core.php';

new \core\Core();