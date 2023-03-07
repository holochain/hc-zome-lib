# This file was generated with the following command:
# update-holochain-versions --git-src=revision:holochain-0.1.3 --output-file=holochain_version.nix
# For usage instructions please visit https://github.com/holochain/holochain-nixpkgs/#readme

{
    url = "https://github.com/holochain/holochain";
    rev = "holochain-0.1.3";
    sha256 = "sha256-619bpPtO0IUSzPzLNzHERuvqGblpjO65rsw3jdxoEkQ=";
    cargoLock = {
        outputHashes = {
        };
    };

    binsFilter = [
        "holochain"
        "hc"
        "kitsune-p2p-proxy"
        "kitsune-p2p-tx2-proxy"
    ];


    lair = {
        url = "https://github.com/holochain/lair";
        rev = "lair_keystore_api-v0.2.3";
        sha256 = "sha256-cqOr7iWzsNeomYQiiFggzG5Dr4X0ysnTkjtA8iwDLAQ=";

        binsFilter = [
            "lair-keystore"
        ];


        cargoLock = {
            outputHashes = {
            };
        };
    };

    scaffolding = {
        url = "https://github.com/holochain/scaffolding";
        rev = "holochain_scaffolding_cli-v0.1.6";
        sha256 = "sha256-CVK1NNYGrmrPqyocS3fw68ehD2xg9pZ7EtOLHhQIi+A=";

        binsFilter = [
            "hc-scaffold"
        ];


        cargoLock = {
            outputHashes = {
            };
        };
    };

    launcher = {
        url = "https://github.com/holochain/launcher";
        rev = "holochain_cli_launch-0.0.9";
        sha256 = "sha256-FC/PT/9fvMvDVbk+S2gWXOAkp8hcEWU0hnaBi9cJVHE=";

        binsFilter = [
            "hc-launch"
        ];


        cargoLock = {
            outputHashes = {
            };
        };
    };
}
