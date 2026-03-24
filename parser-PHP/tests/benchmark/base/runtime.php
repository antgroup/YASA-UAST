<?php

function run($code, $x)
{
    print $x;
    eval($code);
    @$this->call();
    exit($code);
}

$fn = function &($a) use (&$x, $y) {
    return $a + $x + $y;
};
