<?php

namespace module\standart\page\api\backend;

class Page_API_ItemView extends Page_API_Tree {

    public function result($data) {

        if (!isset($data['page_id'])) {
            throw new \Exception('Необходимо указать ID страницы для получения её настроек');
        }

        $page_id = (int) $data['page_id'];

        $sql = 'SELECT
                    `id`,
                    `path`,
                    `hierarchy`,
                    `code`,
                    `name`,
                    `title`,
                    `description`,
                    `keywords`,
                    `template`,
                    `status`
                FROM
                    `sky_page_tree`
                WHERE
                    `id` = :page_id';

        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':page_id', $page_id, \PDO::PARAM_INT);
        $stmt->execute();
        $resultData = $stmt->fetch(\PDO::FETCH_ASSOC);
        $stmt->closeCursor();

        if (!$resultData) {
            throw new \Exception('Страница не найдена');
        }

        $pageLabelModel = $this->core->getModel('page')->getEntety('page_label');
        $resultData['labels'] = $pageLabelModel->query('get_settings_for_page', array(
            'page_id' => $page_id
        ));

        return $resultData;
    }

}