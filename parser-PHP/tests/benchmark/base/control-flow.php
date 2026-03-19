<?php

for ($i = 0; $i < 3; $i++) {
    echo $i;
}

foreach ($items as $k => $v) {
    if ($v) {
        continue;
    }
    break;
}

while ($ok) {
    risky();
    break;
}

do {
    $x = 1;
} while ($flag);

switch ($x) {
    case 1:
        foo();
        break;
    default:
        bar();
}

try {
    risky();
} catch (\Exception $e) {
    throw $e;
} finally {
    cleanup();
}
