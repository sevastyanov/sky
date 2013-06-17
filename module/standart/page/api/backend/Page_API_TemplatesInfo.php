<?php

namespace module\standart\page\api\backend;

class Page_API_TemplatesInfo extends \core\API {

    public function result($data) {

        return $this->core->getTemplates();

    }

}