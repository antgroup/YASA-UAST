use std::process;

fn main() {
    let cli = match uast4rust::parse_args() {
        Ok(cli) => cli,
        Err(uast4rust::ParseArgsError::HelpRequested) => {
            println!("{}", uast4rust::usage());
            process::exit(0);
        }
        Err(err) => {
            eprintln!("{err}");
            process::exit(2);
        }
    };

    if let Err(err) = uast4rust::run(&cli) {
        eprintln!("{err}");
        process::exit(1);
    }
}
