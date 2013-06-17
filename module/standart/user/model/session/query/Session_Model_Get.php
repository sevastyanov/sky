<?php

namespace module\standart\user\model\session\query;

class Session_Model_Get extends \core\model\Model_Query {

    public function query($sessionKey) {

        $sessionKeyParts = explode('|', $sessionKey);

        if (count($sessionKeyParts) !== 2) {
            throw new \Exception();
        }

        $id  = $sessionKeyParts[0];
        $key = $sessionKeyParts[1];

        $sql = 'SELECT
                    `id`,
                    `key`,
                    `cookie`,
                    `user_id`,
                    `created`,
                    `last_visit`
                FROM
                    `sky_user_session`
                WHERE
                    `id` = :id AND `key` = :key';

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute(array(
            ':id'  => $id,
            ':key' => $key
        ));

        return $stmt->fetch(\PDO::FETCH_ASSOC);

    }
}