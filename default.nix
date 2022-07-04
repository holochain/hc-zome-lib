let
  holonixPath = (import ./nix/sources.nix).holonix;
  holonix = import (holonixPath) {
    rustVersion = {
      track = "stable";
      version = "1.60.0";
    };
    holochainVersionId = "custom";
    holochainVersion = import ./holochain_version.nix;
  };
  nixpkgs = holonix.pkgs;
in nixpkgs.mkShell {
  inputsFrom = [ holonix.main ];
  packages = with nixpkgs; [
    niv
    nixpkgs.binaryen
  ];
}