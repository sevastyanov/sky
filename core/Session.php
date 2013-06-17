<?php

namespace core;

class Session extends BaseClass implements \ArrayAccess {

    const SESSION_INDEX = 'sky_sid';

    protected $id = 0;
    protected $userId = 0;
    protected $cookieEnabled = false;
    protected $lastVisit = false;

    public function getId() {
        return $this->id;
    }

    public function getUserId() {
        return $this->userId;
    }

    protected $sessionEntety;

    public function __construct() {

        parent::__construct();

        $this->sessionEntety = $this->core->getModel('user')->getEntety('session');

        if (!isset($_COOKIE[self::SESSION_INDEX])) {
            $session = $this->sessionEntety->command('New', self::SESSION_INDEX);
        } else {
            $session = $this->sessionEntety->query('Get', $_COOKIE[self::SESSION_INDEX]);

            if (!$session) {
                $session = $this->sessionEntety->command('New', self::SESSION_INDEX);
            } else {
                // если идентификация была успешной, но ещё не помечали, что cookie включены, то помечаем
                if (!$session['cookie']) {
                    $this->sessionEntety->command('CookieEnabled', $session['id']);
                    $session['cookie'] = true;
                }

                // проверяем, как давно обновляли дату последнего посещения
                $lastVisit = new \core\DateTime($session['last_visit']);

                if ($lastVisit->getTimestamp() < mktime() - 300) {
                    $this->sessionEntety->command('UpdateLastVisit', $session['id']);
                }
            }
        }

        $this->id            = $session['id'];
        $this->userId        = $session['user_id'];
        $this->cookieEnabled = $session['cookie'];
        $this->lastVisit     = $session['last_visit'];

    }

    public function __destruct() {

        if (!$this->dataLoaded) {
            return;
        }

        $this->sessionEntety->command('SaveData', array(
            'id'   => $this->id,
            'data' => $this->data
        ));

    }

    // Реализация доступа к объекту как к массиву

    protected $data = array();
    protected $dataLoaded = false;

    protected function loadData() {

        if ($this->dataLoaded) {
            return;
        }

        $this->data = $this->sessionEntety->query('LoadData', $this->id);
        $this->dataLoaded = true;
    }

    public function offsetSet($offset, $value) {

        $this->loadData();

        if (is_null($offset)) {
            $this->data[] = $value;
        } else {
            $this->data[$offset] = $value;
        }
    }

    public function offsetExists($offset) {

        $this->loadData();

        return isset($this->data[$offset]);
    }

    public function offsetUnset($offset) {

        $this->loadData();

        unset($this->data[$offset]);
    }

    public function &offsetGet($offset) {

        $this->loadData();

        if (isset($this->data[$offset])) {
            return $this->data[$offset];
        }

        $result = null;

        return $result;
    }


}