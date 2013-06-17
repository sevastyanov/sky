<?php

namespace module\standart\page\model\page_label\query;

class PageLabel_Model_GetSettingsForPage extends \core\model\Model_Query {

    public function query($params) {
        if (!isset($params['page_id'])) {
            throw new \Exception('Необходимо указать ID страницы для получения её настроек');
        }

        $page_id = (int) $params['page_id'];

        $sql = 'SELECT
                    `hierarchy`
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

        $pageIds = explode('/', trim($resultData['hierarchy'], '/'));
        $pageIds[] = $page_id;

        $sql = 'SELECT
                    pl.*
                FROM
                    `sky_page_label` pl
                    LEFT JOIN `sky_page_tree` p ON p.`id` = pl.`page_id`
                WHERE
                    pl.`page_id` IN ('.implode(',', $pageIds).')
                ORDER BY
                    `hierarchy` DESC';

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        $stmt->closeCursor();

        $labels = array();

        foreach ($result as $pageLabel) {
            $labelCode = $pageLabel['label'];

            if (isset($labels[$labelCode])) {
                continue;
            }

            $labels[$labelCode] = array(
                'id'        => $pageLabel['id'],
                'title'     => $labelCode,
                'module'    => $pageLabel['module'],
                'action'    => $pageLabel['action'],
                'data'      => unserialize($pageLabel['data']),
                'inherited' => ($page_id !== (int) $pageLabel['page_id'])
            );
        }

        return $labels;
    }
}