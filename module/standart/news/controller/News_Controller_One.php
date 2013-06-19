<?php

namespace module\standart\news\controller;

class News_Controller_One extends \core\Controller {

    public function init($params = array()) {

        if (!$_GET['id']) {
            return;
        }

        $newsId = (int) $_GET['id'];

        $sql = 'SELECT
                    n.*,
                    u.`firstname`,
                    u.`lastname`,
                    u.`patronymic`
                FROM
                    `sky_news` n
                    LEFT JOIN `sky_user` u ON u.`id` = n.`user_id`
                WHERE
                    n.`id` = :id';

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute(array(
            ':id' => $newsId
        ));

        $item = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!trim($item['description'])) {
            $item['description'] = $item['description_short'];
        }

        $this->view->item = &$item;
        $this->view->setTemplate('news-one');

    }

}