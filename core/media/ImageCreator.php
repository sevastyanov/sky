<?php

namespace core\media;

class ImageCreator {

    const METHOD_CROP = 'crop';
    const METHOD_FIT  = 'fit';
    const METHOD_STRETCH  = 'stretch';
    const BLANK = '/image/blank.jpg';

    protected static $allowedSetups = array();

    public static function loadAllowImages() {

        $allowAutoConvert = array();

        include \DIR_ROOT.'/settings/images.php';

        foreach ($allowAutoConvert as $imgSetup) {
            self::$allowedSetups[$imgSetup] = $imgSetup;
        }

        self::$allowedSetups['100x100_crop()'] = '100x100_crop()';

    }

    protected static function error404() {
        header('HTTP/1.1 404 Not Found');
        die('Image not found');
    }

    public function convertImage($fileName, $width, $height, $method, $params) {

        $setup = "{$width}x{$height}_{$method}($params)";

        if (!isset(self::$allowedSetups[$setup])) {
            self::error404();
        }

        $params = trim($params);

        if ($params) {
            $params = explode(',', $params);
        } else {
            $params = array();
        }

        $img = new \core\media\Image(\DIR_PUBLIC.$fileName, $width, $height);

        switch ($method) {
            case self::METHOD_FIT:
            case self::METHOD_STRETCH:
            case self::METHOD_CROP:

                call_user_func_array(array($img, $method), $params);

                $autoSizeImageFileName = \DIR_PUBLIC.self::getAutoSizeImageFileName($fileName, $setup, true);

                $img->save($autoSizeImageFileName);

                header('Content-Type: '.$img->getMimeType());
                header('Content-Transfer-Encoding: binary');
                header('Content-Length: '.filesize($autoSizeImageFileName));

                ob_clean();
                flush();

                readfile($autoSizeImageFileName);

                die;

            default:
                self::error404();
        }

    }

    protected static function getAutoSizeImageFileName($fileName, $setup, $isAbsoluteFileName = false) {
        if ($isAbsoluteFileName) {
            return '/temp/autosize/'.$setup.$fileName;
        } else {
            return '/temp/autosize/'.rawurlencode($setup).$fileName;
        }
    }

    public function getImageUrl($fileName, $setup = '100x100_crop()') {

        if (!isset(self::$allowedSetups[$setup])) {
            // возвращаем прямую ссылку, чтобы 100500 раз не было обращений к php
            return self::BLANK;
        }

        // тут уже наоборот нужно мкормить преобразованную картинку
        if (!file_exists(\DIR_PUBLIC.$fileName)) {
            $fileName = self::BLANK;
        }

        return self::getAutoSizeImageFileName($fileName, $setup);

    }
}

ImageCreator::loadAllowImages();