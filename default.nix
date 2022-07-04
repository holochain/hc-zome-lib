let
  holonixPath = builtins.fetchTarball "https://github.com/holochain/holonix/archive/d492d68bdb9df1bf374dc68074f6d61b255988a3.tar.gz";
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