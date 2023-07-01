{
  description = "Template for Holochain app development";
    # this can now be udpated directly, e.g.:
    # nix flake lock --override-input holochain github:holochain/holochain/holochain-0.1.3

  inputs = {
    holonix.url = "github:holochain/holochain";
    holonix.inputs.holochain.url = "github:holochain/holochain/holochain-0.3.0-beta-dev.6";
    holonix.inputs.lair.url = "github:holochain/lair/lair_keystore-v0.2.4";
    nixpkgs.follows = "holonix/nixpkgs";
  };

  outputs = inputs@{ holonix, ... }:
    holonix.inputs.flake-parts.lib.mkFlake { inherit inputs; } {
      # provide a dev shell for all systems that the holonix flake supports
      systems = builtins.attrNames holonix.devShells;

      perSystem = { config, system, pkgs, ... }:
        {
          devShells.default = pkgs.mkShell {
            inputsFrom = [ holonix.devShells.${system}.holonix ];
            packages = with pkgs; [
              # add further packages from nixpkgs
              nodejs binaryen 
            ];
          };
        };
    };
}