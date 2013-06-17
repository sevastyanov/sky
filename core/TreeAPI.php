<?php

namespace core;

class TreeAPI extends  API {

    protected $tableName = 'sky_blank_tree';
    protected $processPath = false;

    public function result($data) {

        if (!isset($_GET['action'])) {
            throw new \Exception('Метод для работы с деревом не указан', 3);
        }

        switch ($_GET['action']) {
            case 'get':
                return $this->getChildrens();
            case 'move':
                return $this->moveItem();
            case 'new':
                return $this->createItem();
            case 'edit':
                return $this->editItem($data);
            case 'delete':
                return $this->deleteItem($data);
            default:
                throw new \Exception('Неизвестный метод для работы с деревом', 4);
        }
    }

    protected function createItem() {

        if (!isset($_POST['parent_id'])) {
            throw new \Exception('Не указан идентификатор родителя', 3);
        }

        if (!isset($_POST['name'])) {
            throw new \Exception('Не указано имя создаваемого элемента', 3);
        }

        if ($this->processPath && !isset($_POST['code'])) {
            throw new \Exception('Не указан код создаваемого элемента', 3);
        }

        $parentId = (int) $_POST['parent_id'];
        $name     = $_POST['name'];
        $order    = $this->getNewOrder($parentId);

        $db = $this->getDb();

        $sql = 'INSERT INTO
                  `'.$this->tableName.'`
                SET
                    `parent_id` = :parent_id,
                    `name`      = :name,
                    `order`     = :order
                    '.($this->processPath ? ', `code` = :code' : '');

        $data = array(
            ':parent_id' => $parentId,
            ':name'      => $name,
            ':order'     => $order
        );

        if ($this->processPath) {
            $data[':code'] = $_POST['code'];
        }

        $stmt = $db->prepare($sql);
        $stmt->execute($data);

        $newItemId = $db->lastInsertId();

        $this->rebuildTreeForItem($newItemId);

        return array(
            'id'   => $newItemId,
            'name' => $name
        );
    }

    protected function getChildrens() {

        if (!isset($_GET['node'])) {
            throw new \Exception('Не указан идентификатор родителя', 3);
        }

        $parentId = (int) $_GET['node'];

        $sql = 'SELECT
                     t.`id`,
                     t.`parent_id`,
                     t.`name` AS `text`,
                     (CASE WHEN (SELECT
                         COUNT(*)
                     FROM
                         `'.$this->tableName.'` t3
                     WHERE
                         t3.`parent_id` = t.`id` AND `status` != \'deleted\') = 0 THEN 0 ELSE 1 END) as `expandable`
                FROM
                   `'.$this->tableName.'` t
                WHERE
                   t.`parent_id` = :parent_id
                   AND `status` != \'deleted\'
                ORDER BY
                  t.`hierarchy`, t.`order`';

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute(array(
            ':parent_id' => $parentId
        ));
        $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        $stmt->closeCursor();

        foreach ($result as &$item) {

            $item['expandable'] = !!($item['expandable'] - 0);

            if ($item['parent_id'] === '0') {
                $item['expanded'] = true;
            }
        }

        return $result;
    }

    protected function moveItem() {

        if (!isset($_POST['item_id']) || !isset($_POST['target_item_id']) || !isset($_POST['position'])) {
            throw new \Exception('Неполные данные для перемещения элемента дерева', 3);
        }

        $itemId       = (int) $_POST['item_id'];
        $targetItemId = (int) $_POST['target_item_id'];
        $newOrder     = null;
        $position     = $_POST['position'];

        switch ($position) {
            case 'before':
            case 'after':
                $sql = 'SELECT
                            t.`parent_id`,
                            t.`order`
                        FROM
                            `'.$this->tableName.'` t
                        WHERE
                            t.`id` = :id';

                $stmt = $this->getDb()->prepare($sql);
                $stmt->execute(array(
                    'id' => $targetItemId
                ));
                $result = $stmt->fetch(\PDO::FETCH_ASSOC);
                $stmt->closeCursor();

                if (!$result) {
                    $new_parent_id = 0;
                } else {
                    $new_parent_id = $result['parent_id'];
                    $newOrder = $position === 'before' ? $result['order'] : $result['order'] + 1;
                }

                break;
            case 'append':
                $new_parent_id = $targetItemId;

                break;
            default:
                throw new \Exception('Неизвестная новая позиция для перемещаемого элемента', 3);
        }

        if ($newOrder === null) {
            $newOrder = $this->getNewOrder($new_parent_id);
        }

        $sql = 'UPDATE
                    `'.$this->tableName.'`
                SET
                    `order` = `order` + 1
                WHERE
                    `parent_id` = :parent_id
                    AND `order` >= :order';

        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':order',     $newOrder,      \PDO::PARAM_INT);
        $stmt->bindValue(':parent_id', $new_parent_id, \PDO::PARAM_INT);
        $stmt->execute();
        $stmt->closeCursor();

        $sql = 'UPDATE
                    `'.$this->tableName.'`
                SET
                    `order` = `order` - 1
                WHERE
                    `parent_id` = :parent_id
                    AND `order` < :order';

        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':order',     $newOrder,      \PDO::PARAM_INT);
        $stmt->bindValue(':parent_id', $new_parent_id, \PDO::PARAM_INT);
        $stmt->execute();
        $stmt->closeCursor();

        $sql = 'UPDATE
                    `'.$this->tableName.'`
                SET
                    `parent_id` = :parent_id,
                    `order`     = :order
                WHERE
                    `id` = :id';

        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':id',        $itemId,        \PDO::PARAM_INT);
        $stmt->bindValue(':parent_id', $new_parent_id, \PDO::PARAM_INT);
        $stmt->bindValue(':order',     $newOrder,      \PDO::PARAM_INT);
        $stmt->execute();
        $stmt->closeCursor();

        // надо обновить детенышей
        $this->rebuildTreeForItem($itemId);

    }

    protected function getNewOrder($parentId) {

        $sql = 'SELECT
                    (MAX(`order`) + 1) as new_order
                FROM
                    `'.$this->tableName.'`
                WHERE
                    `parent_id` = :parent_id';

        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':parent_id', $parentId, \PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        $stmt->closeCursor();

        if (!$result || $result['new_order'] === NULL) {
            return 1;
        } else {
            return $result['new_order'];
        }

    }

    protected function rebuildTreeForItem($itemId) {

        $sql = 'SELECT
                    `parent_id`'.($this->processPath ? ', `code`' : '').'
                FROM
                    `'.$this->tableName.'`
                WHERE
                    `id` = :id';

        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':id', $itemId, \PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        $stmt->closeCursor();

        $parentPathAndHierarchy = $this->getParentHierarсhy($result['parent_id']);
        $itemHierarchyArray = $parentPathAndHierarchy['hierarchy'];
        $itemHierarchyArray[] = $result['parent_id'];

        if ($this->processPath) {
            $itemPathArray = $parentPathAndHierarchy['path'];
            $itemPathArray[] = $result['code'];
        } else {
            $itemPathArray = false;
        }

        $this->_updateChildrens($itemId, $itemHierarchyArray, $itemPathArray);
    }

    protected function _updateChildrens($itemId, $itemHierarchyArray, $itemPathArray = false) {

        $setData = array(
            '`hierarchy` = :hierarchy',
            '`level`     = :level'
        );

        if ($this->processPath) {
            $setData[] = '`path` = :path';
        }

        $sql = 'UPDATE
                    `'.$this->tableName.'`
                SET
                    '.implode(', ', $setData).'
                WHERE
                    `id` = :item_id';

        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':hierarchy', '/'.implode('/', $itemHierarchyArray).'/', \PDO::PARAM_STR);
        $stmt->bindValue(':level',     count($itemHierarchyArray) - 1,            \PDO::PARAM_INT);
        $stmt->bindValue(':item_id',   $itemId,                                   \PDO::PARAM_INT);

        if ($this->processPath) {
            $stmt->bindValue(':path', implode('/', $itemPathArray), \PDO::PARAM_STR);
        }

        $stmt->execute();

        $sql = 'SELECT
                    `id`'.($this->processPath ? ', `code`' : '').'
                FROM
                    `'.$this->tableName.'`
                WHERE
                    `parent_id` = :id';

        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':id', $itemId, \PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        if (!empty($result)) {

            $childHierarchyArray = $itemHierarchyArray;
            $childHierarchyArray[] = $itemId;

            foreach ($result as $child) {

                $childId = $child['id'];
                //$childHierarchyArray[] = $childId;

                if ($this->processPath) {
                    $childPathArray = $itemPathArray;
                    $childPathArray[] = $child['code'];
                } else {
                    $childPathArray = false;
                }

                $this->_updateChildrens($childId, $childHierarchyArray, $childPathArray);
            }
        }
    }

    protected function getParentHierarсhy($parent_id) {

        $parent_id = (int) $parent_id;

        if ($parent_id === 0) {
            return array(
                'hierarchy' => array('0'),
                'path' => array(),
            );
        }

        $sql = 'SELECT
                    `hierarchy`'.($this->processPath ? ', `path`' : '').'
                FROM
                    `'.$this->tableName.'`
                WHERE
                    `id` = :id';

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute(array(
            ':id' => $parent_id
        ));
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        $stmt->closeCursor();

        if (!$result) {
            throw new \Exception('Не найден новый родитель для перемещаемого элемента', 3);
        }

        $resultHierarсhy = explode('/', trim($result['hierarchy'], '/'));
        //$resultHierarсhy[] = $parent_id;

        if ($this->processPath) {
            $resultPath = explode('/', $result['path']);
        } else {
            $resultPath = false;
        }

        return array(
            'hierarchy' => $resultHierarсhy,
            'path' => $resultPath
        );
    }

    protected $editedFields = array(
        'parent_id',
        'name',
        'description'
    );

    protected function deleteItem($data) {

        if (!isset($data['id'])) {
            throw new \Exception('Не указан идентификатор удаляемого элемента', 3);
        }

        $sql = 'SELECT
                    `hierarchy`
                FROM
                    `'.$this->tableName.'`
                WHERE
                    `id` = :id';

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute(array(
            ':id' => $data['id']
        ));

        $item = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$item) {
            throw new \Exception('Удаляемая запись не найдена', 3);
        }

        $hierarchy = $item['hierarchy'].'/%';

        $stmt->closeCursor();

        $sql = 'UPDATE
                    `'.$this->tableName.'`
                SET
                    `status` = \'deleted\'
                WHERE
                    `id` = :id OR `hierarchy` LIKE \''.$hierarchy.'\'';

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute(array(
            ':id' => $data['id']
        ));

    }

    protected function editItem($data) {

        if (!isset($data['id'])) {
            throw new \Exception('Не указан идентификатор обновляемого элемента', 3);
        }

        if ($this->processPath) {
            $sql = 'SELECT
                        `hierarchy`,
                        `path`,
                        `code`
                    FROM
                        `'.$this->tableName.'`
                    WHERE
                        `id` = :id';

            $stmt = $this->getDb()->prepare($sql);
            $stmt->execute(array(
                ':id' => $data['id']
            ));

            $oldData = $stmt->fetch(\PDO::FETCH_ASSOC);
            $stmt->closeCursor();
        }

        $updateData = array();

        foreach ($this->editedFields as $field) {
            if (isset($data[$field])) {
                $updateData[$field] = $data[$field];
            }
        }

        if (isset($data['id'])) {
            $updateData['id'] = $data['id'];
        }

        $this->update($updateData);

        if ($this->processPath && isset($updateData['code']) && $updateData['code'] !== $oldData['code']) {
            $this->rebuildTreeForItem($data['id']);
        }
    }

    protected function update($data) {

        if (!isset($data['id'])) {
            throw new \Exception('Не указан идентификатор обновляемого элемента', 3);
        }

        $newData = array();
        $updates = array();

        foreach ($data as $field => $value) {
            $key = ":$field";
            $newData[$key] = $value;
            $updates[] = "$field = $key";
        }

        $sql = 'UPDATE
                    `'.$this->tableName.'`
               SET
                    '.implode(',', $updates).'
               WHERE
                    id = :id';

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute($newData);
        $stmt->closeCursor();

    }
}