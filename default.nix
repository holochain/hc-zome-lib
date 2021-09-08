let
  holonixPath = builtins.fetchTarball {
    url = "https://github.com/holochain/holonix/archive/3e94163765975f35f7d8ec509b33c3da52661bd1.tar.gz";
    sha256 = "sha256:07sl281r29ygh54dxys1qpjvlvmnh7iv1ppf79fbki96dj9ip7d2";
  };
  holonix = import (holonixPath) {
    includeHolochainBinaries = true;
    holochainVersionId = "custom";

    holochainVersion = {
     rev = "dc382be2a8a26d7c345e023cfaa0d8f6181697db";
     sha256 = "sha256:0fwsnqb1kw1nv1rl2cwqxx0dwya807pzqlcrl8ih0kmb7yv3h6a7";
     cargoSha256 = "sha256:0y72lm5b0fl9anb2z9pcx1i3shqdlckz04zx3phc084hbzpig4cq";
     bins = {
       holochain = "holochain";
       hc = "hc";
       kitsune-p2p-proxy = "kitsune_p2p/proxy";
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