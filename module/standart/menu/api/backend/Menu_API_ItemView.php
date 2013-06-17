<?php

namespace module\standart\menu\api\backend;

class Menu_API_ItemView extends Menu_API_Tree {

    public function result($data) {

        if (!isset($data['menu_id'])) {
            throw new \Exception('Необходимо указать ID элемента меню для получения его настроек');
        }

        $menu_id = (int) $data['menu_id'];

        $sql = 'SELECT
                    m.`id`,
                    m.`name`,
                    m.`inherit_name_from_page`,
                    m.`page_id`,
                    p.`hierarchy` as page_hierarchy,
                    m.`status`
                FROM
                    `sky_menu_tree` m
                    LEFT JOIN `sky_page_tree` p ON p.`id` = m.`page_id`
                WHERE
                    m.`id` = :menu_id';

        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':menu_id', $menu_id, \PDO::PARAM_INT);
        $stmt->execute();
        $resultData = $stmt->fetch(\PDO::FETCH_ASSOC);
        $stmt->closeCursor();

        if (!$resultData) {
            throw new \Exception('Пункт меню не найден');
        }

        return $resultData;
    }

}