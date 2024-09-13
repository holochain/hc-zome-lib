{
  description = "Template for Holochain app development";

  inputs = {
    versions.url = "github:holochain/holochain?dir=versions/weekly";
    versions.inputs.holochain.url = "github:holochain/holochain/holochain-0.4.0-dev.24";
    versions.inputs.lair.url = "github:holochain/lair/lair_keystore-v0.5.0";

    holochain-flake.url = "github:holochain/holochain";
    holochain-flake.inputs.versions.follows = "versions";

    nixpkgs.follows = "holochain-flake/nixpkgs";
    flake-parts.follows = "holochain-flake/flake-parts";
  };

  outputs = inputs:
    inputs.flake-parts.lib.mkFlake { inherit inputs; }
      {
        systems = builtins.attrNames inputs.holochain-flake.devShells;

        perSystem =
          { inputs'
          , config
          , pkgs
          , system
          , ...
          }: {

            devShells.default = pkgs.mkShell {
              inputsFrom = [ inputs'.holochain-flake.devShells.holochainBinaries ];
              packages = [
                pkgs.nodejs-18_x
                pkgs.binaryen
                # more packages go here
              ];
            };
          };
      };
}
