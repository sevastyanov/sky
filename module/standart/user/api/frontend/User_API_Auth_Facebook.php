<?php

namespace module\standart\user\api\frontend;

class User_API_Auth_Facebook extends \core\API {

    public function getContentType() {
        return self::CONTENT_TYPE_HTML;
    }

    public function result($data) {

        $code = $_GET['code'];

        $url = 'http://'.$_SERVER['HTTP_HOST'].'/api/?api_module=user&api_action=Auth_Facebook';

        $token_url = 'https://graph.facebook.com/oauth/access_token'.
            '?client_id='.'512930385426937'.
            '&redirect_uri='.urlencode($url).
            '&client_secret=' . 'f1061b64c5d8dfbaea1ae2659f0123d9'.
            '&code=' . $code;

        $ch = curl_init();

        // установка URL и других необходимых параметров
        curl_setopt($ch, CURLOPT_URL, $token_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);

        // загрузка страницы и выдача её браузеру
        $result = curl_exec($ch);

        $result = explode('&', $result);
        $resultValues = array();

        foreach ($result as $value) {
            $value = explode('=', $value);
            $resultValues[$value[0]] = $value[1];
        }

        $query = 'SELECT+uid,+first_name,+middle_name,+last_name,+sex+FROM+user+WHERE+uid=me()';

        $fql_query_url = 'https://graph.facebook.com/'
            . 'fql?q='.$query
            . '&access_token=' . $resultValues['access_token'];

        curl_setopt($ch, CURLOPT_URL, $fql_query_url);

        $fql_query_result = curl_exec($ch);;

        // завершение сеанса и освобождение ресурсов
        curl_close($ch);

        $fql_query_obj = json_decode($fql_query_result, true, 512, JSON_BIGINT_AS_STRING);
        $facebookUserInfo = $fql_query_obj['data'][0];

        $oAuth = $this->core->getModel('user')->getEntety('oauth');
        $exists = $oAuth->query('Find', array(
            'server_id'  => 1,
            'server_uid' => $facebookUserInfo['uid']
        ));

        if (!$exists) {
            $user_id = $this->core->getModel('user')->getEntety('user')->command('RegisterOAuthFacebook', $facebookUserInfo);
        } else {
            $user_id = $exists['user_id'];
        }

        $this->core->getModel('user')->getEntety('session')->command('SetUser', array(
            'user_id' => $user_id,
            'session_id' => $this->core->getSession()->getId()
        ));

        //$access_token = file_get_contents($token_url);

        //file_put_contents('C:/test_fb.txt', 'url = '.$fql_query_url.PHP_EOL.'$result = '.var_export($fql_query_obj, true));

        return '<!doctype html>
                    <html>
                        <head>
                            <script>
                                if (window.top !== window) {
                                    window.top.$(window.top).trigger(\'fb_auth_success\');
                                } else {
                                    window.location = "/";
                                }
                            </script>
                        </head>
                    </html>';
    }
}