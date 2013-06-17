<?php

namespace module\standart\page\controller;

class Page_Controller_Index extends \core\Controller {

    protected $viewClass = '\core\view\PageView';

    protected $controllers = array();

    public function init($path) {

        $core = $this->core;
        $bootstrap = $this->core->getBootstrap();

        $sql = 'SELECT
                    *
                FROM
                    `sky_page_tree`
                WHERE
                    `path` = :path
                    AND `status` = \'active\'';

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute(array(
            ':path' => $path
        ));
        $page = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$page) {
            die('Страница не найдена');
        }

        $pageLabelModel = $core->getModel('page')->getEntety('page_label');
        $labelsSettings = $pageLabelModel->query('get_settings_for_page', array(
            'page_id' => $page['id']
        ));
        $templates = $core->getTemplates();

        $pageLabels = $templates[$page['template']]['labels'];
        $controllers = array();

        foreach ($pageLabels as $labelCode => $title) {
            if (isset($labelsSettings[$labelCode])) {
                $label = $labelsSettings[$labelCode];
                $controllers[$labelCode] = $bootstrap->getController($label['module'], $label['action']);
                $controllers[$labelCode]->init($label['data']);
            }
        }

        $this->controllers = $controllers;
        $this->view->getBody()->setTemplate('body-'.$page['template']);

        $head = $this->view->getHead();

        //$head->BASE_HREF = URL_ADMIN;
        $head->TITLE = $page['title'];

        $head->addScript('//ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js');
        $head->addScript('//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js');
        $head->addStyleSheet('//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/overcast/jquery-ui.min.css');

        //$head->addStyleSheet('/themes/standart/css/main.css');

        $head->THEME = new \core\ThemeLoader();
        $head->SKY_JS = new \core\JsMinimizer();

    }

    public function prepare() {
        foreach ($this->controllers as $controller) {
            $controller->prepare();
        }
    }

    public function content() {
        $labelsContents = array();
        foreach ($this->controllers as $labelCode => $controller) {
            $labelsContents[$labelCode] = array(
                'content' => $controller->content(),
                'module'  => $controller->getModuleName(),
                'action'  => $controller->getAction(),
                'nowrap'  => $controller->getNoWrap()
            );
        }
        $this->view->getBody()->setLabelsContents($labelsContents);
        return parent::content();
    }

}