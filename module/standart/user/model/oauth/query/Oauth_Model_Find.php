<?php

namespace module\standart\user\model\oauth\query;

class Oauth_Model_Find extends \core\model\Model_Query {

    public function query($params) {

        $server_id  = $params['server_id'];
        $server_uid = $params['server_uid'];

        $sql = 'SELECT * FROM `sky_user_oauth` WHERE `server_id` = :server_id AND `server_uid` = :server_uid';

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute(array(
            ':server_id' =>  $server_id,
            ':server_uid' => $server_uid
        ));

        return $stmt->fetch(\PDO::FETCH_ASSOC);

    }
}