let
  holonixPath = builtins.fetchTarball "https://github.com/holochain/holonix/archive/2a1c9124f52e18e7829bea62e8cc476572a0bd32.tar.gz";
  holonix = import (holonixPath) {
    includeHolochainBinaries = true;
    holochainVersionId = "custom";

    holochainVersion = {
     rev = "06c82ade3128ccc73b7b24a137d8fad3756927ef";
     sha256 = "1fykfqslr7lhbp11wbl7cz5pmygw9wmhlkvvnfn9ig9ddr7nq6sw";
     cargoSha256 = "11s50qq7719grgijnw2z2wi27xa918ycjnsmcd5a8c2kvf4al3yw";
     bins = {
       holochain = "holochain";
       hc = "hc";
     };
     lairKeystoreHashes = {
        sha256 = "12n1h94b1r410lbdg4waj5jsx3rafscnw5qnhz3ky98lkdc1mnl3";
        cargoSha256 = "0axr1b2hc0hhik0vrs6sm412cfndk358grfnax9wv4vdpm8bq33m";
      };
    };
  };
  nixpkgs = holonix.pkgs;
in nixpkgs.mkShell {
  inputsFrom = [ holonix.main ];
  buildInputs = with nixpkgs; [
    binaryen
  ];
}
