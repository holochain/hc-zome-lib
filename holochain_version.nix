# This file was generated with the following command:
# update-holochain-versions --git-src=revision:holochain-0.1.0-beta-rc.4 --output-file=holochain_version.nix
# For usage instructions please visit https://github.com/holochain/holochain-nixpkgs/#readme

{
    url = "https://github.com/holochain/holochain";
    rev = "holochain-0.1.0-beta-rc.4";
    sha256 = "sha256-Rr66+kZf5GTnXlhyBfM3U0uXJU2k3l4xSMcH23x0Wz4=";
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
        rev = "holochain_scaffolding_cli-v0.0.6";
        sha256 = "sha256-IlQ1OnsJP7T4Tc3JxoRuKKDQLlg11U9DzSAezO0pZ7c=";

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
        rev = "holochain_cli_launch-0.0.6";
        sha256 = "sha256-zLp8pEl3nLKh6SidAQprDmmbFvHUKpxUCZoJU4HJrBo=";

        binsFilter = [
            "hc-launch"
        ];


        cargoLock = {
            outputHashes = {
                "holochain_client-0.2.0" = "sha256-NwvDNJ36h5k/6TsuFuOuejCIIyRHAMD/NrTwPsC0k4M=";
            };
        };
    };
}
