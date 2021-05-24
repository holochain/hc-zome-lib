let
  holonixPath = builtins.fetchTarball {
    url = "https://github.com/holochain/holonix/archive/9a1f11bacf0a4a8d5cfb83b449df5f726c569c7c.tar.gz";
    sha256 = "sha256:0j4v354rlipifw2ibydr02nv6bwm33vv63197srswkvv6wi6dr9c";
  };
  holonix = import (holonixPath) {
    includeHolochainBinaries = true;
    holochainVersionId = "custom";

    holochainVersion = {
     rev = "ddb7d8d9310d1e6cf4cdc198c0c765ea5d70b9e0";
     sha256 = "1rbhxxh3z8kf17lj8w6dp5vj2rrkaqvxv2m6lxi74fxla5i5ar7f";
     cargoSha256 = "14979svzr4rklxz13a281c9qa8i5q0472bcfijj8hyrhfnvnzg2p";
     bins = {
       holochain = "holochain";
       hc = "hc";
     };
    };
    holochainOtherDepsNames = ["lair-keystore"];
  };
in holonix.main
