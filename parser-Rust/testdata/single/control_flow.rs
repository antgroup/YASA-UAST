pub fn flow(xs: Vec<i32>, flag: bool) -> i32 {
    let mut sum = 0;

    if flag {
        sum += 1;
    } else {
        sum += 2;
    }

    for x in xs {
        while sum < 10 {
            if x == 0 {
                break;
            }
            sum += x;
            continue;
        }
    }

    loop {
        sum += 1;
        break;
    }

    match sum {
        0 => return 0,
        1 | 2 => return 1,
        _ => return sum,
    }
}
