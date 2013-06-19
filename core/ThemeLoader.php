<?php

namespace core;

class ThemeLoader extends BaseClass {

    protected $version = '0.0.2';
    protected $files = array();
    protected $themePath = '';
    protected $debug = true;

    protected function loadCssList() {

        $this->themePath = \DIR_ROOT.'/view/'.$this->core->getDesign();

        $fileName = $this->themePath.'/css.php';

        $fn = function($fileName) {

            $css = array();
            $version = 0;

            include_once $fileName;

            return array(
                'css' => $css,
                'version' => $version
            );

        };

        $result = $fn($fileName);

        $this->files = $result['css'];
        $this->version  = $result['version'];

    }

    protected function getFullStyleSheet() {

        $this->loadCssList();

        $result = '';

        foreach ($this->files as $moduleCode => &$files) {

            foreach ($files as $fileName) {

                $result .= "\n".file_get_contents($this->themePath.'/module/'.$moduleCode.'/css/'.$fileName);

            }

        }

        return $result;
    }

    public function __toString() {

        if ($this->debug) {
            return $this->toString_debug();
        }

        return $this->toString_deploy();

    }

    protected function toString_debug() {
        return '<style type="text/css">'.$this->getFullStyleSheet().'</style>';
    }

    protected function toString_deploy() {

        $themeFileName = '/themes/'.$this->core->getDesign().'/css/theme-'.$this->version.'.css';
        $themeAbsoluteFileName = \DIR_PUBLIC.$themeFileName;

        if (!file_exists($themeAbsoluteFileName)) {
            file_put_contents($themeAbsoluteFileName, $this->getFullStyleSheet());
        }

        return '<link rel="stylesheet" type="text/css" href="'.$themeFileName.'">';
    }

}