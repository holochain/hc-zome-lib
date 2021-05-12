let
  holonixPath = builtins.fetchTarball {
    url = "https://github.com/holochain/holonix/archive/9a1f11bacf0a4a8d5cfb83b449df5f726c569c7c.tar.gz";
    sha256 = "sha256:0j4v354rlipifw2ibydr02nv6bwm33vv63197srswkvv6wi6dr9c";
  };
  holonix = import (holonixPath) {
    includeHolochainBinaries = true;
    holochainVersionId = "custom";

    holochainVersion = {
     rev = "a1ae76ecc1fc7dbd645fee3a8cb0df9f610be983";
     sha256 = "04kha2vxzh3ml452xsdz40f3jbchlad0lf741862n56x4np2spa2";
     cargoSha256 = "0q9nl0wqvyd5jbxq92f1h4l7i439kl5j1bkzxlz929q4m43r3apn";
     bins = {
       holochain = "holochain";
       hc = "hc";
     };
    };
    holochainOtherDepsNames = ["lair-keystore"];
  };
in holonix.main
