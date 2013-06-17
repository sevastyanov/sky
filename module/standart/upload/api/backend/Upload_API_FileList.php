<?php

namespace module\standart\upload\api\backend;

class Upload_API_FileList extends \core\API {

    public function result($data) {


        $files = array();

        $dirName = \DIR_UPLOAD;

        switch (getenv('OS')) {
            case 'Windows_NT':

                $fso = new \Com('Scripting.FileSystemObject', null, CP_UTF8);

                foreach ($fso->getFolder($dirName)->SubFolders as $file) {
                    $files[] = array(
                        'name' => $file->Name,
                        'url'  => \URL_UPLOAD.'/'.$file->Name,
                        'size' => $file->Size,
                        'lastmod' => $file->DateLastModified,
                        'is_dir' => true
                    );
                }

                foreach ($fso->getFolder($dirName)->Files as $file) {
                    $files[] = array(
                        'name' => $file->Name,
                        'url'  => \URL_UPLOAD.'/'.$file->Name,
                        'size' => $file->Size,
                        'lastmod' => $file->DateLastModified,
                        'is_dir' => false
                    );
                }

                break;

            default:

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

        }

        return $files;

    }

}