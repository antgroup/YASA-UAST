pub struct User {
    id: i32,
    name: String,
}

pub fn process(user: User, input: i32) -> i32 {
    let mut value = input;
    value = user.id;
    user.touch(value);
    return value;
}
