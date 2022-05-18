let
  holonixPath = builtins.fetchTarball "https://github.com/holochain/holonix/archive/507049ba661aa0113f24e03d0f8307caaa3124a9.tar.gz";
  holonix = import (holonixPath) {
    holochainVersionId = "custom";
    holochainVersion = import ./holochain_version.nix;
  };
  nixpkgs = holonix.pkgs;
in nixpkgs.mkShell {
  inputsFrom = [ holonix.main ];
  packages = [
    nixpkgs.binaryen
  ];
}