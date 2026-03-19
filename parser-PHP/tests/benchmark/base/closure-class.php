<?php

class Demo extends BaseClass
{
    public $name = 'x';
    private static $count = 1;
    const DEFAULT_COUNT = 2;

    public function build($input)
    {
        $handler = function ($x) use ($input) {
            return $x + $input;
        };

        $alias =& $input;
        $copy = clone $this;

        if (isset($alias, $copy) && !empty($input)) {
            return $handler($alias);
        }

        return null;
    }
}
