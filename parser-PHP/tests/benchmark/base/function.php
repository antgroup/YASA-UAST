<?php
function foo($x, $y = 1) {
    if ($x) {
        return bar($y);
    }
    return 0;
}
