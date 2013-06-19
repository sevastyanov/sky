<?php

namespace module\standart\menu\controller;

class Menu_Controller_Menu extends \core\Controller {

    protected $tree = array();

    public function init($params = array()) {

        $menu_id = $params['id'];

        $sql = 'SELECT
                    t.`id`, t.`parent_id`, t.`name`, t.`status`, t.`page_id`, p.`path`, p.`status` as page_status
                FROM
                    `sky_menu_tree` t
                    LEFT JOIN `sky_page_tree` p ON p.`id` = t.`page_id`
                WHERE
                    t.`hierarchy` LIKE \'/0/'.$menu_id.'/%\'
                ORDER BY
                    t.`hierarchy`, t.`order`';

        $items = $this->getDb()->query($sql)->fetchAll(\PDO::FETCH_ASSOC);

        $tree = array();
        $treeIndex = array();

        foreach ($items as &$item) {

            $item['children'] = array();
            $treeIndex[$item['id']] = &$item;

            // если элемент меню отключен или страница отключена, то пункт меню и его детеныши не отображаются в меню
            if ($item['status'] !== 'active' || $item['page_status'] !== 'active' || $item['page_id'] == 0) {
                continue;
            }

            if (!isset($treeIndex[$item['parent_id']])) {
                $tree[] = &$item;
            } else {
                $treeIndex[$item['parent_id']]['children'][] = &$item;
            }

            unset($item);
        }

        $this->view->TYPE = $params['type'];
        $this->view->MENU = &$tree;
        $this->view->setTemplate('menu');

    }

}