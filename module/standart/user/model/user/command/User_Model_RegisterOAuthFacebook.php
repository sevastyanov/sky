<?php

namespace module\standart\user\model\user\command;

class User_Model_RegisterOAuthFacebook extends \core\model\Model_Command {

    public function command($facebookAccInfo) {

        // создаем учетную запись
        $sql = 'INSERT INTO `sky_user` (
                    `lastname`, `firstname`, `patronymic`, `status`
                ) VALUES (
                    :lastname,  :firstname,  :patronymic,  \'active\'
                )';

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute(array(
            ':lastname' => $facebookAccInfo['last_name'],
            ':firstname' => $facebookAccInfo['first_name'],
            ':patronymic' => $facebookAccInfo['middle_name'],
        ));

        $user_id = $this->getDb()->lastInsertId();

        // помечаем её связанной с аккаунтом фэйсбука
        $sql = 'INSERT INTO `sky_user_oauth` (
                    `server_id`, `server_uid`, `user_id`, `date`
                ) VALUES (
                    :server_id,  :server_uid,  :user_id,  NOW()
                )';

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute(array(
            ':server_id' => 1,
            ':server_uid' => $facebookAccInfo['uid'],
            ':user_id' => $user_id,
        ));

        return $user_id;

    }
}