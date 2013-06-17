<?php

namespace module\standart\upload\api\backend;

class Upload_API_Upload extends \core\API {

    public function result($data) {

        $dirName = \DIR_UPLOAD;

        $errors = array();
        $success = array();

        if (isset($_FILES['uploaded_files'])) {

            $files = $_FILES['uploaded_files'];

            $count = count($files['name']);

            for ($i = 0; $i < $count; $i++) {
                $tmp_name = $files['tmp_name'][$i];
                $name = $files['name'][$i];
                $error = $files['error'][$i];

                if ($error != \UPLOAD_ERR_OK) {
                    $errors[] = array(
                        'file' => $name,
                        'error' => $error
                    );
                }


                $success[] = $name;

                $destFileName = $dirName.'/'.$name;


                switch (getenv('OS')) {
                    case 'Windows_NT':

                        $fso = new \Com('Scripting.FileSystemObject', null, CP_UTF8);


                        if ($fso->FileExists($destFileName)) {
                            continue;
                        }

                        $fso->CopyFile($tmp_name, $destFileName, false);

                        break;

                    default:

                        if (file_exists($destFileName)) {
                            continue;
                        }

                        copy($tmp_name, $destFileName);
                        chmod($destFileName, 0777);
                }
            }
        }

        die(
        '<html>
            <head>
                <script>
                    function getUploadResult() {
                        return '.json_encode(array('errors' => $errors, 'success' => $success)).';
                    }
                </script>
            </head>
        </html>');

    }


}