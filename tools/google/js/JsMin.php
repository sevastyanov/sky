<?php

namespace tools\google\js;

class JsMin
{
    const COMPILATION_OPTIONS_DEFAULT = ' --compilation_level WHITESPACE_ONLY --formatting PRETTY_PRINT '; // простая минимизация с вырезанием комментариев и лишних пробелов
    const COMPILATION_OPTIONS_MAX     = ''; // максимальная минимизация

    public static function run($files, $outputFileName, $compilationOptions)
    {
        $bat = 'java -jar '.__DIR__.'/compiler.jar '.$compilationOptions.' --js';

        foreach ($files as &$file)
        {
            $bat .= ' '.$file;
        }

        $bat .= " --js_output_file ".$outputFileName . " 2>&1";

        $output = array();

        exec($bat, $output);

        if (!empty($output))
        {
            echo '<pre>';
            echo "Обнаружена ошибка:\n\n";

            foreach ($output as $line)
            {
                echo iconv('866', 'utf-8', $line)."\n";
            }
            echo '</pre>';
        }
    }
}