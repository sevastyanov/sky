<?php

namespace core;

class DateTime extends \DateTime {

    public function formatToSqlDateTime() {
        return $this->format('Y-m-d H:i:s');
    }

}