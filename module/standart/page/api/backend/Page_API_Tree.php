<?php

namespace module\standart\page\api\backend;

class Page_API_Tree extends \core\TreeAPI {

    protected $tableName = 'sky_page_tree';
    protected $processPath = true;

    protected $editedFields = array(
        'parent_id',
        'code',
        'title',
        'name',
        'title',
        'description',
        'keywords',
        'template',
        'status',
    );

    protected function editItem($data) {
        parent::editItem($data);

        if (!empty($data['labels'])) {

            $page_id = $data['id'];

            foreach ($data['labels'] as $label) {
                $id = $label['id'];

                if ($id) {
                    if ($label['module'] === 'inherit') {
                        $sql = 'DELETE FROM
                                    `sky_page_label`
                                WHERE
                                    `id` = :id';

                        $stmt = $this->getDb()->prepare($sql);
                        $stmt->execute(array(
                            ':id'     => $id,
                        ));
                    } else {
                        $sql = 'UPDATE
                                `sky_page_label`
                            SET
                                `module` = :module,
                                `action` = :action,
                                `data`   = :data
                            WHERE
                                `id` = :id';

                        $stmt = $this->getDb()->prepare($sql);
                        $stmt->execute(array(
                            ':module' => $label['module'],
                            ':action' => $label['action'],
                            ':data'   => serialize($label['data']),
                            ':id'     => $id,
                        ));
                    }
                } else {
                    $sql = 'INSERT INTO `sky_page_label` (
                                `page_id`, `label`, `module`, `action`, `data`
                            ) VALUES (
                                :page_id,  :label,  :module,  :action,  :data
                            )';
                    $stmt = $this->getDb()->prepare($sql);
                    $stmt->execute(array(
                        ':page_id' => $page_id,
                        ':label'   => $label['label'],
                        ':module'  => $label['module'],
                        ':action'  => $label['action'],
                        ':data'    => serialize($label['data'])
                    ));
                }
            }
        }
    }

}