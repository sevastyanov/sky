<?php

namespace module\standart\menu\api\backend;

class Menu_API_List extends Menu_API_Tree {

    public function result($data) {

        $sql = 'SELECT
                    m.`id`,
                    m.`name`
                FROM
                    `sky_menu_tree` m
                WHERE
                    m.`status` = \'active\'
                    AND m.`parent_id` = 0';

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute();
        $resultData = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        $stmt->closeCursor();

        return $resultData;
    }

}