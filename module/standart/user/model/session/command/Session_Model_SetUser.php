<?php

namespace module\standart\user\model\session\command;

class Session_Model_SetUser extends \core\model\Model_Command {

    public function command($params) {

        $user_id    = $params['user_id'];
        $session_id = $params['session_id'];

        $sql = 'UPDATE
                    `sky_user_session`
                SET
                    `user_id` = :user_id,
                    `last_visit` = NOW()
                WHERE
                    `id` = :id';

        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':id', (int) $session_id, \PDO::PARAM_INT);
        $stmt->bindValue(':user_id', (int) $user_id, \PDO::PARAM_INT);
        $stmt->execute();

    }
}