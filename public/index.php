<?php

include_once '../app.php';

return;

global $money, $cena_studia, $cena_odnushka;

$money = 700000;
$cena_studia = 2700000;
$cena_odnushka = 4000000;
function getStavka($price, $years) {

    global $money;

    $firstPay = $money * 100 / $price;

    if ($firstPay < 20) {
        $item = array(13.25, 13.50, 13.75);
    } elseif ($firstPay < 30) {
        $item = array(13.00, 13.25, 13.50);
    } elseif ($firstPay < 40) {
        $item = array(12.50, 12.75, 13.00);
    } else {
        $item = array(10.00, 12.50, 12.75);
    }

    if ($years <= 5) {
        return $item[0]/100;
    }

    if ($years <= 15) {
        return $item[1]/100;
    }

    return $item[2]/100;
}
function getStavka_odnushka($years, $returnPercents = false) {
    global $cena_odnushka;
    $result = getStavka($cena_odnushka, $years) - 0.01;
    if ($returnPercents) {
        return ($result * 100).'%';
    }
    return $result;
}
function getStavka_studia($years, $returnPercents = false) {
    global $cena_studia;
    $result = getStavka($cena_studia, $years) - 0.01;
    if ($returnPercents) {
        return ($result * 100).'%';
    }
    return $result;
}
$stavka = 0.1175;

$dates = array(
    -5 => 'май.2012',
    -4 => 'июн.2012',
    -3 => 'июл.2012',
    -2 => 'авг.2012',
    -1 => 'сен.2012',
    0 => 'окт.2012',
    1 => 'дек.2012',
    2 => 'янв.2013',
    3 => 'фев.2013',
    4 => 'мар.2013',
    5 => 'апр.2013',
    6 => 'май.2013',
    7 => 'июн.2013',
    8 => 'июл.2013',
    9 => 'авг.2013',
    10 => 'сен.2013',
    11 => 'окт.2013',
    12 => 'ноя.2013',
    13 => 'дек.2013',
    14 => 'янв.2014'
);

$zp = array(
    -5 => 21200,
    -4 => 21200,
    -3 => 21200,
    -2 => 21200,
    -1 => 21200,
    0 => 21200,
    1 => 30761.9 + 2019,
    2 => 72417.38,
    3 => 65000,
    4 => 68894.34,
    5 => 80000,
    6 => 82965.03,
    7 => 80000,
    8 => 80000,
    9 => 80000,
    10 => 80000,
    11 => 80000,
    12 => 80000,
    13 => 80000,
    14 => 80000
);

$zp_bez_nalogov = array();

foreach($zp as $key => $zp_month) {
    $zp_bez_nalogov[$key] = round($zp_month * 0.87, 2);
}

$sr_zp = array(
    -5 => 18444,
    -4 => 18444,
    -3 => 18444,
    -2 => 18444,
    -1 => 18444,
    0 => 18444,
);
$sr_zp_50 = array(
    -5 => 9222,
    -4 => 9222,
    -3 => 9222,
    -2 => 9222,
    -1 => 9222,
    0 => 9222,
);
$sr_zp_40 = array(
    -5 => 7377.6,
    -4 => 7377.6,
    -3 => 7377.6,
    -2 => 7377.6,
    -1 => 7377.6,
    0 => 7377.6,
);

for ($i = 1; $i <= 14; $i++) {
    $summ = 0;
    for ($j = $i - 6; $j < $i; $j++) {
        $summ += $zp_bez_nalogov[$j];
    }
    $sr_zp[$i] = round($summ / 6, 2);
    $sr_zp_50[$i] = round($summ * 0.5 / 6, 2);
    $sr_zp_40[$i] = round($summ * 0.4 / 6, 2);
}

/*
 * X = (S*p) / (1-(1+p)^(1-m))

X - размер аннуитетного платежа;
S - сумма кредита;
p - 1/12 годовой процентной ставки, выраженная в сотых долях;
^ - означает в степени;
m - срок кредита, в месяцах.

 */
$p = $stavka / 12;

$X = array(
    'studia'   => array(),
    'odnushka' => array()
);

$months = 60;
$p = getStavka_studia(5)/12;
$X['studia'][5] = round((($cena_studia - $money) * $p) / (1 - pow(1 + $p, 1 - $months)));
$p = getStavka_odnushka(5)/12;
$X['odnushka'][5] = round((($cena_odnushka - $money) * $p) / (1 - pow(1 + $p, 1 - $months)));

$months = 120;
$p = getStavka_studia(10)/12;
$X['studia'][10] = round((($cena_studia - $money) * $p) / (1 - pow(1 + $p, 1 - $months)));
$p = getStavka_odnushka(10)/12;
$X['odnushka'][10] = round((($cena_odnushka - $money) * $p) / (1 - pow(1 + $p, 1 - $months)));

$months = 180;
$p = getStavka_studia(15)/12;
$X['studia'][15] = round((($cena_studia - $money) * $p) / (1 - pow(1 + $p, 1 - $months)));
$p = getStavka_odnushka(15)/12;
$X['odnushka'][15] = round((($cena_odnushka - $money) * $p) / (1 - pow(1 + $p, 1 - $months)));

$months = 240;
$p = getStavka_studia(20)/12;
$X['studia'][20] = round((($cena_studia - $money) * $p) / (1 - pow(1 + $p, 1 - $months)));
$p = getStavka_odnushka(20)/12;
$X['odnushka'][20] = round((($cena_odnushka - $money) * $p) / (1 - pow(1 + $p, 1 - $months)));

?>
<!DOCTYPE HTML>
<HTML>
    <HEAD>
        <STYLE TYPE="text/css">
            th, td {
                border: 1px solid silver;
                padding: 2px;
            }

            th {
                background-color: silver;
            }

            .red {
                background-color: #ffb18e;
            }

            .yellow {
                background-color: #fff1a6;
            }
            .green {
                background-color: #78ff62;
            }
        </STYLE>
    </HEAD>
    <BODY>
        <h2>Исходные данные</h2>
        Первоначальный взнос: <?php echo $money ?> руб.<BR>
        Цена студии: <?php echo $cena_studia ?> руб. (первоначальный взнос: <?php echo round($money * 100/$cena_studia, 1) ?>%)<BR>
        Цена однокомнатной квартиры: <?php echo $cena_odnushka ?> руб. (первоначальный взнос: <?php echo round($money * 100/$cena_odnushka, 1) ?>%)<BR>
        <h2>Необходимый ежемесячный платеж для покупки квартиры</h2>
        <TABLE>
            <COLGROUP>
                <COL style="width: 150px;">
                <COL style="width: 150px;">
                <COL style="width: 150px;">
            </COLGROUP>
            <THEAD>
                <TR>
                    <TH style='text-align: center;' rowspan="2">
                        Период кредитования, лет
                    </TH>
                    <TH style='text-align: center;' colspan='2'>
                        Ежемесячный платеж, руб.
                    </TH>
                </TR>
                <TR>
                    <TH style='text-align: center;'>
                        Студия
                    </TH>
                    <TH style='text-align: center;'>
                        Однокомнатная квартира
                    </TH>
                </TR>
            </THEAD>
            <TBODY>
                <?php

                foreach ($X['studia'] as $years => $value) {
                    echo "<TR><TD style='text-align: center;'>$years</TD><TD style='text-align: center;'>$value</TD><TD style='text-align: center;'>{$X['odnushka'][$years]}</TD></TR>";
                }

                ?>
            </TBODY>
        </TABLE>
        <h2>Сводная таблица, отображающая реальные возможности на покупку квартиры в обозримом будущем</h2>
        <TABLE>
            <COLGROUP>
                <COL style="width: 150px;">
                <COL style="width: 150px;">
                <COL style="width: 150px;">
                <COL style="width: 150px;">
                <COL style="width: 150px;">
                <COL style="width: 150px;">

                <COL style="width: 50px;">
                <COL style="width: 200px;">

                <COL style="width: 75px;">
                <COL style="width: 75px;">
                <COL style="width: 75px;">
                <COL style="width: 75px;">
                <COL style="width: 75px;">
                <COL style="width: 75px;">
                <COL style="width: 75px;">
                <COL style="width: 75px;">

                <COL style="width: 75px;">
                <COL style="width: 75px;">
                <COL style="width: 75px;">
                <COL style="width: 75px;">
                <COL style="width: 75px;">
                <COL style="width: 75px;">
                <COL style="width: 75px;">
                <COL style="width: 75px;">
            </COLGROUP>
            <THEAD>
                <TR>
                    <TH rowspan="4">
                        Дата
                    </TH>
                    <TH colspan="2">
                        З/П
                    </TH>
                    <TH rowspan="4">
                        ср. З/П за предыдущие 6 мес.
                    </TH>
                    <TH colspan="2" rowspan="2">
                        Максимальный платеж, из расчёта
                    </TH>
                    <TH rowspan="4" style="background-color: transparent; border: none;">

                    </TH>
                    <TH rowspan="2">

                    </TH>
                    <TH colspan="8">
                        Возможность купить студию
                    </TH>
                    <TH colspan="8">
                        Возможность купить однокомнатную квартиру
                    </TH>
                </TR>
                <TR>
                    <TH rowspan="3">
                        До вычета налогов
                    </TH>
                    <TH rowspan="3">
                        После вычета налогов
                    </TH>

                    <TH colspan="2">
                        кредит на 5 лет
                    </TH>
                    <TH colspan="2">
                        кредит на 10 лет
                    </TH>
                    <TH colspan="2">
                        кредит на 15 лет
                    </TH>
                    <TH colspan="2">
                        кредит на 20 лет
                    </TH>
                    <TH colspan="2">
                        кредит на 5 лет
                    </TH>
                    <TH colspan="2">
                        кредит на 10 лет
                    </TH>
                    <TH colspan="2">
                        кредит на 15 лет
                    </TH>
                    <TH colspan="2">
                        кредит на 20 лет
                    </TH>
                </TR>
                <TR>
                    <TH rowspan="2">
                        40%
                    </TH>
                    <TH rowspan="2">
                        50%
                    </TH>
                    <TH>
                        Максимальный ежемесячный платеж, в % от з/п
                    </TH>
                    <TH>
                        40%
                    </TH>
                    <TH>
                        50%
                    </TH>
                    <TH>
                        40%
                    </TH>
                    <TH>
                        50%
                    </TH>
                    <TH>
                        40%
                    </TH>
                    <TH>
                        50%
                    </TH>
                    <TH>
                        40%
                    </TH>
                    <TH>
                        50%
                    </TH>
                    <TH>
                        40%
                    </TH>
                    <TH>
                        50%
                    </TH>
                    <TH>
                        40%
                    </TH>
                    <TH>
                        50%
                    </TH>
                    <TH>
                        40%
                    </TH>
                    <TH>
                        50%
                    </TH>
                    <TH>
                        40%
                    </TH>
                    <TH>
                        50%
                    </TH>
                </TR>
                <TR>
                    <TH>
                        Ставка по кредиту
                    </TH>
                    <TH colspan="2">
                        <?php echo getStavka_studia(5, true) ?>
                    </TH>
                    <TH colspan="2">
                        <?php echo getStavka_studia(10, true) ?>
                    </TH>
                    <TH colspan="2">
                        <?php echo getStavka_studia(15, true) ?>
                    </TH>
                    <TH colspan="2">
                        <?php echo getStavka_studia(20, true) ?>
                    </TH>
                    <TH colspan="2">
                        <?php echo getStavka_odnushka(5, true) ?>
                    </TH>
                    <TH colspan="2">
                        <?php echo getStavka_odnushka(10, true) ?>
                    </TH>
                    <TH colspan="2">
                        <?php echo getStavka_odnushka(15, true) ?>
                    </TH>
                    <TH colspan="2">
                        <?php echo getStavka_odnushka(20, true) ?>
                    </TH>
                </TR>
            </THEAD>
            <TBODY>
            <?php
                foreach ($dates as $key => $name) {
                    //if ($key < 5) continue;
                    echo "
                    <TR>
                        <TD>$name</TD>
                        <TD>{$zp[$key]}</TD>
                        <TD>{$zp_bez_nalogov[$key]}</TD>
                        <TD>{$sr_zp[$key]}</TD>
                        <TD>{$sr_zp_40[$key]}</TD>
                        <TD>{$sr_zp_50[$key]}</TD>
                        <TD style='background-color: transparent; border: none;'></TD>
                        <TD></TD>";

                        foreach ($X as $X_type) {
                            foreach ($X_type as $x) {
                                $className_40 = $x < $sr_zp_40[$key] ? 'green' : 'red';
                                $className_50 = $x < $sr_zp_50[$key] ? 'green' : 'red';

                                echo "
                                <TD class='$className_40'></TD>
                                <TD class='$className_50'></TD>
                                ";
                            }
                        }

                    echo "
                    </TR>";
                }
            ?>
            </TBODY>
        </TABLE>
    </BODY>
</HTML>
