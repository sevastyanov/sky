<?php

namespace module\standart\user\api\backend;

class User_API_UserEdit extends \core\API {

    public function result($data) {

        $require = array('login', 'lastname', 'firstname', 'patronymic', 'status');
        $values = array();

        foreach ($require as $field) {
            if (!isset($data[$field])) {
                throw new \Exception('Не заполнены необходимые поля');
            }
            $values[':'.$field] = $data[$field];
        }

        $setFields = array(
            '`login`      = :login',
            '`lastname`   = :lastname',
            '`firstname`  = :firstname',
            '`patronymic` = :patronymic',
            '`status`     = :status'
        );

        if (!empty($data['password'])) {

            $values[':password'] = $this->core->getModel('user')->getEntety('user')->query('EncriptPassword', $data['password']);

            $setFields[] = '`password` = :password';
        }

        if (!empty($data['id'])) {

            $values[':id'] = $data['id'];

            $sql = 'UPDATE
                        `sky_user`
                    SET
                        '.implode(',', $setFields).'
                    WHERE
                        `id` = :id';

            $stmt = $this->getDb()->prepare($sql);
            $stmt->execute($values);
        } else {
            $sql = 'INSERT INTO
                        `sky_user`
                    SET
                        '.implode(',', $setFields);

            $stmt = $this->getDb()->prepare($sql);
            $stmt->execute($values);

            return $this->getDb()->lastInsertId();

        }

    }

}