pub fn regression(xs: Vec<(i32, i32)>, v: i32, cond: bool) -> i32 {
    let _range_to = ..3;

    for (i, _) in xs {
        for j in 0..=2 {
            if i == j {
                break;
            }
        }
    }

    match v {
        1 if cond => return 10,
        1 => return 20,
        x => return x,
    }
}
