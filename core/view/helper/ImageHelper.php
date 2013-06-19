<?php

namespace core\view\helper;

class ImageHelper extends \core\View {

    protected $resultUrl;

    public function image($fileName, $setup = '100x100_crop()') {

        $imageCreator = new \core\media\ImageCreator();

        $this->resultUrl = $imageCreator->getImageUrl($fileName, $setup);

    }

    public function render() {
        return $this->resultUrl;
    }

}