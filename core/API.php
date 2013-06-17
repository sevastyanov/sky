<?php

namespace core;

class API extends  BaseClass {

    const CONTENT_TYPE_JSON = 'json';
    const CONTENT_TYPE_HTML = 'html';

    public function getContentType() {
        return self::CONTENT_TYPE_JSON;
    }

    /**
     * @param \core\Core $core
     * @throws \Exception
     */
    public static function run($core) {

        try {
            if (!isset($_GET['api_module']) && !isset($_POST['api_module'])) {
                throw new \Exception('Модуль API не указан', 1);
            }

            $api_module = isset($_GET['api_module']) ? $_GET['api_module'] : $_POST['api_module'];

            if (!isset($_GET['api_action']) && !isset($_POST['api_action'])) {
                throw new \Exception('Метод API не указан', 2);
            }

            $api_action = isset($_GET['api_action']) ? $_GET['api_action'] : $_POST['api_action'];

            $api = $core->getBootstrap()->getAPI($api_module, $api_action);

            if (isset($_GET['api_data']) || isset($_POST['api_data'])) {
                $data = json_decode(isset($_GET['api_data']) ? $_GET['api_data'] : $_POST['api_data'], true);
            } else {
                $data = false;
            }

            $result = $api->result($data);

            $result = array(
                'error_code' => 0,
                'error_message' => 'OK',
                'result' => $result
            );

        } catch (\Exception $e) {
            $result = array(
                'error_code' => $e->getCode(),
                'error_message' => $e->getMessage(),
                'error_file' => $e->getFile(),
                'error_line' => $e->getLine(),
                'result' => false
            );
            header('HTTP/1.1 400 Bad Request');
            die($e->getMessage());
        }

        switch ($api->getContentType()) {

            case self::CONTENT_TYPE_HTML:

                header('Content-type: text/html; charset=utf8');
                die($result['result']);

                break;

            case self::CONTENT_TYPE_JSON:
            default:

                header('Content-type: application/json');
                die(json_encode($result));

                break;
        }
    }
}