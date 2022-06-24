# This file was generated with the following command:
# update-holochain-versions --nvfetcher-dir=nix/nvfetcher --output-file=packages/holochain/versions/develop_lair_0_1.nix --bins-filter=holochain,hc,kitsune-p2p-proxy,kitsune-p2p-tx2-proxy --git-src=branch:develop --lair-version-req=~0.1
# For usage instructions please visit https://github.com/holochain/holochain-nixpkgs/#readme

{
    url = "https://github.com/holochain/holochain";
    rev = "holochain-0.0.145";
    sha256 = "18pkrnf9p0b6hriyf9jk52hds6d10h6z8bkaxmigl1xv4vwm2a1p";
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
        rev = "27e3a4e305e2a5d48ba625aa3bfac9516d2583ed";
        sha256 = "0xisp3rqdnjsypxpjcin94qwsgvb99vwisq49jjl6x7qxl2s3afm";

        binsFilter = [
            "lair-keystore"
        ];


        cargoLock = {
            outputHashes = {
            };
        };
    };
} 