<?php

function fetch($req, $items)
{
    $name = $req?->user()?->name;
    $value = $items ?? [];

    yield $value;
    yield from source();

    return $name;
}
