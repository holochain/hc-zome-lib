# hc-zome-module

This module is has been designed to be included in other DNAs, assuming as little as possible from those.

### List of available zomes

- `profile` : This profile zome is a simple implementation of managing agent details

## Installation and usage

### Including the zome in your DNA

1. Create a new `profile` folder in the `zomes` of the consuming DNA.
2. Add a new `Cargo.toml` in that folder. In its content, paste the `Cargo.toml` content from any zome.
3. Change the `name` properties of the `Cargo.toml` file to `profile`.
4. Add this zome as a dependency in the `Cargo.toml` file:

```toml
[dependencies]
profile = {git = "https://github.com/zo-el/hc-zomes", package = "profile"}
```

5. Create a `src` folder besides the `Cargo.toml` with this content:

```rust
extern crate profile;
```

6. Add the zome into your `*.dna.workdir/dna.yaml` file.
7. Compile the DNA with the usual `CARGO_TARGET_DIR=target cargo build --release --target wasm32-unknown-unknown`.
