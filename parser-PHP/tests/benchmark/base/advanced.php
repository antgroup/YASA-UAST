<?php

const APP = 1;

declare(strict_types=1);

function choose($v)
{
    $value = match ($v) {
        1 => foo(),
        2, 3 => bar(),
        default => baz(),
    };

    return $value;
}

declare(ticks=1) {
    echo APP;
}
