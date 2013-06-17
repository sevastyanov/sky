<?php

namespace core;

use \tools\google\js\JsMin;

class JsMinimizer extends BaseClass {

    protected $debug = false;
    protected $version = '0.0.3';
    protected $autoMin = true;

    protected $js = array(
        '/src/Function.js',
        '/src/Sky.js',
        '/src/sky/ClassManager.js',
        '/src/sky/Class.js',
        '/src/sky/DOM.js',
        '/src/sky/PopupManager.js',
        '/src/sky/module/user/Auth.js'
    );

    protected $basePath = '/js/sky';

    public function __construct() {

        parent::__construct();

    }

    public function __toString() {

        if ($this->debug) {
            return $this->toStringDebug(microtime(true));
        } else {
            return $this->toStringDeploy();
        }

    }

    protected function toStringDebug($version) {

        $result = array(
            '<script>
                window.sky = window.sky || {};

                sky.isDebug  = true;
                sky.basePath = "'.$this->basePath.'";
                sky.build    = '.$version.';
             </script>'
        );

        foreach ($this->js as $file) {
            $result[] = '<script src="'.$this->basePath.$file.'?v='.$version.'"></script>';
        }

        return implode("\n", $result);

    }

    protected function toStringDeploy() {

        $minFile = $this->basePath.'/min/sky-'.$this->version.'.min.js';
        $minFileAbsolutePath = \DIR_PUBLIC.$minFile;

        $resultText = '<script>'.
                         'window.sky = window.sky || {};'.
                         'sky.isDebug  = false;'.
                         'sky.basePath = "'.$this->basePath.'";'.
                         'sky.build    = "'.$this->version.'";'.
                       '</script>'.
                       '<script src="'.$minFile.'"></script>';

        if (file_exists($minFileAbsolutePath)) {
            return $resultText;
        }

        if (!$this->autoMin) {
            return $this->toStringDebug($this->version);
        }

        $contentPath = \DIR_PUBLIC.$this->basePath;

        $files = array();

        foreach ($this->js as $file) {
            $files[] = $contentPath.$file;
        }

        JsMin::run($files, $minFileAbsolutePath, JsMin::COMPILATION_OPTIONS_DEFAULT);

        return $resultText;

    }

}