<?php

namespace core\media;

class Image {

    protected $src;
    protected $dst;
    protected $width = 0;
    protected $height = 0;
    protected $dstWidth = 0;
    protected $dstHeight = 0;
    protected $type;
    protected $mime;

    public function getMimeType() {
        return $this->mime;
    }

    public function __construct($fileName, $width, $height) {

        $fullFileName = $fileName;

        $fileInfo = getimagesize($fullFileName);

        $this->width = $fileInfo[0];
        $this->height = $fileInfo[1];
        $this->type = $fileInfo[2];
        $this->mime = $fileInfo['mime'];

        switch ($this->type) {
            case \IMAGETYPE_JPEG:
                $this->src = imagecreatefromjpeg($fileName);
                break;

            case \IMAGETYPE_PNG:
                $this->src = imagecreatefrompng($fileName);
                break;

            case \IMAGETYPE_GIF:
                $this->src = imagecreatefromgif($fileName);
                break;

            default:
                throw new \Exception('Данный тип картинок не поддерживается');
        }

        $this->dst       = imagecreatetruecolor((int) $width, (int) $height);
        $this->dstWidth  = (int) $width;
        $this->dstHeight = (int) $height;

    }

    protected static $colors = array(
        'white'   => '#fff',
        'silver'  => '#c0c0c0',
        'gray'    => '#808080',
        'black'   => '#000',
        'maroon'  => '#800000',
        'red'     => '#f00',
        'orange'  => '#ffa500',
        'yellow'  => '#ff0',
        'olive'   => '#808000',
        'lime'    => '#0f0',
        'green'   => '#008000',
        'aqua'    => '#0ff',
        'blue'    => '#00f',
        'navy'    => '#000080',
        'teal'    => '#008080',
        'fuchsia' => '#f0f',
        'purple'  => '#800080'
    );

    protected function cssToColor($color) {

        if ($color[0] !== '#') {
            if (isset(self::$colors[$color])) {
                $color = self::$colors[$color];
            } else {
                throw new \Exception('Неправильный формат цвета');
            }
        }

        switch (strlen($color)) {
            case 4:
                $r = intval($color[1].$color[1], 16);
                $g = intval($color[2].$color[2], 16);
                $b = intval($color[3].$color[3], 16);
                break;

            case 7:
                $r = intval($color[1].$color[2], 16);
                $g = intval($color[3].$color[4], 16);
                $b = intval($color[5].$color[6], 16);
                break;

            default:
                throw new \Exception('Неправильный формат цвета');
        }

        return imagecolorallocate($this->dst, $r, $g, $b);

    }

    public function fill($color) {
        imagefill($this->dst, 0, 0, $this->cssToColor($color));
    }

    public function crop() {

        $aspectRatioSrc = $this->width / $this->height;
        $aspectRatioDst = $this->dstWidth / $this->dstHeight;

        if ($aspectRatioSrc > $aspectRatioDst) {
            // базовый отсчёт идет от высоты
            $src_h = $this->height;
            $src_w = $src_h * $aspectRatioDst;
            $src_x = (int) (($this->width - $src_w) / 2);
            $src_y = 0;
        } else {
            // базовый отсчёт идет от ширины
            $src_w = $this->width;
            $src_h = (int) ($src_w / $aspectRatioDst);
            $src_x = 0;
            $src_y = (int) (($this->height - $src_h) / 2);
        }

        $dst_h = $this->dstHeight;
        $dst_w = $this->dstWidth;
        $dst_x = 0;
        $dst_y = 0;

        imagecopyresampled($this->dst, $this->src, $dst_x, $dst_y, $src_x, $src_y, $dst_w, $dst_h, $src_w , $src_h);
    }

    public function fit($color = '#fff') {

        $this->fill($color);

        $aspectRatioSrc = $this->width / $this->height;
        $aspectRatioDst = $this->dstWidth / $this->dstHeight;

        if ($aspectRatioSrc > $aspectRatioDst) {
            // базовый отсчёт идет от ширины

            $dst_w = $this->dstWidth;
            $dst_h = (int) ($dst_w / $aspectRatioSrc);
            $dst_x = 0;
            $dst_y = (int) (($this->dstHeight - $dst_h) / 2);
        } else {
            // базовый отсчёт идет от высоты
            $dst_h = $this->dstHeight;
            $dst_w = (int) ($dst_h * $aspectRatioSrc);
            $dst_x = (int) (($this->dstWidth - $dst_w) / 2);
            $dst_y = 0;
        }

        $src_w = $this->width;
        $src_h = $this->height;
        $src_x = 0;
        $src_y = 0;

        imagecopyresampled($this->dst, $this->src, $dst_x, $dst_y, $src_x, $src_y, $dst_w, $dst_h, $src_w , $src_h);
    }

    public function stretch() {

        $src_h = $this->height;
        $src_w = $this->width;
        $src_x = 0;
        $src_y = 0;

        $dst_h = $this->dstHeight;
        $dst_w = $this->dstWidth;
        $dst_x = 0;
        $dst_y = 0;

        imagecopyresampled($this->dst, $this->src, $dst_x, $dst_y, $src_x, $src_y, $dst_w, $dst_h, $src_w , $src_h);
    }

    public function save($dstFileName) {

        $dir = dirname($dstFileName);

        if (!file_exists($dir) || !is_dir($dir)) {
            mkdir($dir, 0777, true);
            chmod($dir, 0777);
        }

        switch ($this->type) {
            case \IMAGETYPE_JPEG:
                imagejpeg($this->dst, $dstFileName, 80);
                break;

            case \IMAGETYPE_PNG:
                imagepng($this->dst, $dstFileName, 9, \PNG_FILTER_NONE);
                break;

            case \IMAGETYPE_GIF:
                imagegif($this->dst, $dstFileName);
                break;
        }

    }

}