<?php

interface Runner
{
    public function run($x);
}

trait HelperTrait
{
    public function helper()
    {
        return 1;
    }
}

function demo()
{
    global $a, $b;
    static $cache = 1;
    unset($a, $b);

    [$x, $y] = foo();
    list($m, $n) = bar();

    return [$x, $y, $m, $n];
}
