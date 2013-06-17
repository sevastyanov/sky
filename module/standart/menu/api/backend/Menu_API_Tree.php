<?php

namespace module\standart\menu\api\backend;

class Menu_API_Tree extends \core\TreeAPI {

    protected $tableName = 'sky_menu_tree';
    protected $processPath = false;

    protected $editedFields = array(
        'parent_id',
        'name',
        'status',
        'page_id',
    );

}