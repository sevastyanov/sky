<?php

$modules = array(
    'page' => array(
        'className' => 'sky.module.standart.page.PageModule',
        'title' => 'Страницы',
        'visible' => true,
    ),
    'statics' => array(
        'className' => 'sky.module.standart.static.StaticModule',
        'title' => 'Статичный контент',
        'visible' => false,
    ),
    'menu' => array(
        'className' => 'sky.module.standart.menu.MenuModule',
        'title' => 'Меню',
        'visible' => true,
    ),
    'user' => array(
        'className' => 'sky.module.standart.user.UserModule',
        'title' => 'Пользователи',
        'visible' => true,
    ),
    'news' => array(
        'className' => 'sky.module.standart.news.NewsModule',
        'title' => 'Новости',
        'visible' => true,
    ),
);