<?php

namespace module\standart\user\api\backend;

class User_API_UserList extends \core\API {

    public function result($data) {

        //api_module=user&api_action=UserList&start=0&limit=25&page=1
        $start = isset($_GET['start']) ? $_GET['start'] : 0;
        $limit = isset($_GET['limit']) ? $_GET['limit'] : 25;

        $sql = 'SELECT SQL_CALC_FOUND_ROWS
                    *
                FROM
                    `sky_user`
                LIMIT :start, :limit';

        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':start', (int) $start, \PDO::PARAM_INT);
        $stmt->bindValue(':limit', (int) $limit, \PDO::PARAM_INT);
        $stmt->execute();
        $resultData = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        $stmt->closeCursor();

        $total = $this->getDb()->query('SELECT FOUND_ROWS() as total')->fetch(\PDO::FETCH_ASSOC);

        return array(
            'items' => $resultData,
            'total' => $total['total']
        );

    }

}