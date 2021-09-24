# hc-zome-module

This module is has been designed to be included in other DNAs, assuming as little as possible from those.

### List of available zomes

- `profile` : This profile zome is a simple implementation of managing agent details

## Installation and usage

### Including the zome in your DNA

1. Create a new folder with the zome name (e.g `profile`) in the `zomes` of the consuming DNA.
2. Add a new `Cargo.toml` in that folder. paste the bellow content in.

```toml
[package]
name = "<ZOME_NAME>"
version = "0.0.0"
authors = [ "" ]
edition = "2018"

[lib]
name = "<ZOME_NAME>"
crate-type = [ "cdylib", "rlib" ]

[dependencies]
<ZOME_NAME> = {git = "https://github.com/zo-el/hc-zomes", branch = "develop", package = "<ZOME_NAME>"}
hdk = "0"
hc_utils = "0"
```

3. Change the all properties of the `Cargo.toml` file from `<ZOME_NAME>` to the appropriate zome you want to import.
4. Create a `src/lib.rs` folder besides the `Cargo.toml` with this content:

```rust
extern crate <ZOME_NAME>;
```

5. Add the zome into your `*.dna.workdir/dna.yaml` file.
6. Compile the DNA with the usual `CARGO_TARGET_DIR=target cargo build --release --target wasm32-unknown-unknown`.
