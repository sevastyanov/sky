<?php

namespace module\standart\upload\api\backend;

class Upload_API_FileList extends \core\API {

    public function result($data) {


        $files = array();

        $fileList = scandir(\DIR_UPLOAD);
        $folders = array();

        foreach ($fileList as $file) {

            if ($file === '.' || $file === '..') {
                continue;
            }

            $fileName = \DIR_UPLOAD.'/'.$file;

            $fileData = array(
                'name' => $file,
                'url'  => \URL_UPLOAD.'/'.$file,
                'size' => filesize($fileName),
                'lastmod' => filemtime($fileName),
                'is_dir' => is_dir($fileName)
            );

            if (!$fileData['is_dir']) {
                $files[] = $fileData;
            } else {
                $folders[] = $fileData;
            }
        }

        $files = array_merge($folders, $files);


        return $files;

    }

}