<?php

class Demo
{
    const NAME = 'demo';
}

$a = "Hello $name";
$b = <<<'TXT'
raw
TXT;
$c = __FILE__;
$d = Demo::NAME;
$e = self::NAME;
$i = (int)$x;
$s = (string)$y;
$arr = (array)$z;
