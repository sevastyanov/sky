<?php

namespace module\standart\user\model\session\command;

class Session_Model_UpdateLastVisit extends \core\model\Model_Command {

    public function command($id) {

        $sql = 'UPDATE
                    `sky_user_session`
                SET
                    `last_visit` = NOW()
                WHERE
                    `id` = :id';

        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':id', (int) $id, \PDO::PARAM_INT);
        $stmt->execute();

    }
}