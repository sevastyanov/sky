<?php

namespace core\view;

class BodyView extends \core\View {
	
	public function __construct($moduleName, $template = 'body') {
	
		parent::__construct($moduleName);
	
		$this->setTemplate($template);
	
	}

    public function LABEL($labelCode) {
        if (isset($this->labelsContents[$labelCode])) {
            $data = $this->labelsContents[$labelCode];
            $className = 'sky-'.$data['module'].' sky-'.$data['module'].'-'.$data['action'];

            if (!$data['nowrap']) {
                echo '<div class="'.$className.'">';
            }

            echo $data['content'];

            if (!$data['nowrap']) {
                echo '</div>';
            }

        }
    }

    protected $labelsContents = array();

    public function setLabelsContents($labelsContents) {
        $this->labelsContents = $labelsContents;
    }
	
}