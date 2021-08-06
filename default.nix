let
  holonixPath = builtins.fetchTarball {
    url = "https://github.com/holochain/holonix/archive/e6d0100088d793c6b06bd2833fe3f805ba4605c2.tar.gz";
    sha256 = "sha256:175xxxj8pifzdyd8f5nxb1v1sgzi1ahcawfmnn75f9cn2rvq126g";
  };
  holonix = import (holonixPath) {
    includeHolochainBinaries = true;
    holochainVersionId = "custom";

    holochainVersion = {
     rev = "bd89d55e397baf7876099f600db997c89dd70fb6";
     sha256 = "sha256:1nbq8qq4hzww5460khhv5ihj76bsnfqs306dcyknb2rq2firl1m1";
     cargoSha256 = "sha256:1hbdcks7hkd3924wjy9qkizyn2hvhdvm14m23sjl9nn3xygj8w7w";
     bins = {
       holochain = "holochain";
       hc = "hc";
     };
    };
    holochainOtherDepsNames = ["lair-keystore"];
  };
nixpkgs = holonix.pkgs;
in nixpkgs.mkShell {
  inputsFrom = [ holonix.main ];
  buildInputs = with nixpkgs; [
    binaryen
  ];
}
