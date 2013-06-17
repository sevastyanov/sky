<?php

namespace module\standart\news\api\backend;

class News_API_NewsEdit extends \core\API {

    public function result($data) {

        $require = array('name', 'description_short', 'description', 'status');
        $values = array();

        foreach ($require as $field) {
            if (!isset($data[$field])) {
                throw new \Exception('Не заполнены необходимые поля');
            }
            $values[':'.$field] = $data[$field];
        }

        $setFields = array(
            '`name`                = :name',
            '`description_short`   = :description_short',
            '`description`         = :description',
            '`status`              = :status'
        );

        if (!empty($data['id'])) {

            $values[':id'] = $data['id'];

            $sql = 'UPDATE
                        `sky_news`
                    SET
                        '.implode(',', $setFields).'
                    WHERE
                        `id` = :id';

            $stmt = $this->getDb()->prepare($sql);
            $stmt->execute($values);
        } else {

            $setFields[] = '`user_id` = :user_id';
            $setFields[] = '`created` = NOW()';

            $values[':user_id'] = $this->core->getSession()->getUserId();


            $sql = 'INSERT INTO
                        `sky_news`
                    SET
                        '.implode(',', $setFields);

            $stmt = $this->getDb()->prepare($sql);
            $stmt->execute($values);

            return $this->getDb()->lastInsertId();

        }

    }

}