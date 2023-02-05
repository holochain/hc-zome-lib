# This file was generated with the following command:
# update-holochain-versions --git-src=revision:holochain-0.1.0 --output-file=holochain_version.nix
# For usage instructions please visit https://github.com/holochain/holochain-nixpkgs/#readme

{
    url = "https://github.com/holochain/holochain";
    rev = "holochain-0.1.0";
    sha256 = "sha256-jSEWpZut7OgdBVPOpLoLPGAZT0+pnSngvc5oEsNy67M=";
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
        rev = "holochain_scaffolding_cli-v0.1.5";
        sha256 = "sha256-roFeEEHyGpPdAsyFwKdDwPPtGuXNhbOqu9K8giOEXmI=";

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
