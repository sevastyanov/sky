<?php

namespace module\standart\news\controller;

class News_Controller_List extends \core\Controller {

    public function init($page_one_id) {

        $sql = 'SELECT
                    `path`
                FROM
                    `sky_page_tree`
                WHERE
                    `id` = :id';

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute(array(
            ':id' => $page_one_id
        ));
        $pageInfo = $stmt->fetch(\PDO::FETCH_ASSOC);
        $pageOnePath = $pageInfo['path'];


        $sql = 'SELECT
                    n.*,
                    u.`firstname`,
                    u.`lastname`,
                    u.`patronymic`
                FROM
                    `sky_news` n
                    LEFT JOIN `sky_user` u ON u.`id` = n.`user_id`
                ORDER BY
                    n.`created` DESC
                LIMIT
                    25';

        $items = $this->getDb()->query($sql)->fetchAll(\PDO::FETCH_ASSOC);

        foreach ($items as &$item) {
            $item['link'] = $pageOnePath.'?id='.$item['id'];
        }

        $this->view->items = &$items;
        $this->view->setTemplate('news-list');

    }

}