<?php

namespace core;

class User extends BaseClass {


    public function __construct() {

        parent::__construct();

        $userId = $this->core->getSession()->getUserId();

        if ($userId) {
            $this->loadById($userId);
            return;
        }

    }

    public function loadById($id) {

        $sql = 'SELECT
                    *
                FROM
                    `sky_user`
                WHERE
                    `id` = :id';

        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':id', (int) $id, \PDO::PARAM_INT);

        $this->loadStatement($stmt);

    }

    protected $userInfo;

    public function getInfo() {
        return $this->userInfo;
    }

    protected function loadStatement($stmt) {

        $stmt->execute();
        $this->userInfo = $stmt->fetch(\PDO::FETCH_ASSOC);

    }



}