<?php

namespace module\standart\user\model\session\command;

class Session_Model_New extends \core\model\Model_Command {

    protected $salt_1 = 'ew9we^;wef5$vjewf';
    protected $salt_2 = 'qdwEdkm8^hfeuyTYu';

    protected function generateSID() {
        $part_1 = md5($this->salt_1.mt_rand(1, 1000).md5($this->salt_2.microtime(true)));
        $part_2 = md5($this->salt_2.mt_rand(1, 1000).md5($this->salt_1.$_SERVER['REMOTE_ADDR']));

        return $part_1.$part_2;
    }

    public function command($sessionIndex) {

        $sessionKey = $this->generateSID();

        $sql = 'INSERT INTO `sky_user_session` (
                    `key`, `ip`, `user_agent`, `created`, `last_visit`
                ) VALUES (
                    :key,  :ip, :user_agent, NOW(),  NOW()
                )';

        $db = $this->getDb();

        $stmt = $db->prepare($sql);
        $stmt->bindValue(':key', $sessionKey, \PDO::PARAM_STR);
        $stmt->bindValue(':ip',  $_SERVER['REMOTE_ADDR'], \PDO::PARAM_STR);
        $stmt->bindValue(':user_agent',  $_SERVER['HTTP_USER_AGENT'], \PDO::PARAM_STR);
        $stmt->execute();

        $sessionId = $db->lastInsertId();

        $sessionValue = $sessionId.'|'.$sessionKey;

        setcookie($sessionIndex, $sessionValue, time() + 31536000, '/');

        return $this->entety->query('Get', $sessionId.'|'.$sessionKey);

    }
}