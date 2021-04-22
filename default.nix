let
  holonixPath = builtins.fetchTarball {
    url = "https://github.com/holochain/holonix/archive/87ad95a9a0b08deea64ad77ac14a68a7f12cff52.tar.gz";
    sha256 = "0fvbbaps9aggqkjr00b3b331avh0fjb2b8gn07yglshsgix7wrhh";
  };
  holonix = import (holonixPath) {
    includeHolochainBinaries = true;
    holochainVersionId = "custom";

    holochainVersion = {
     rev = "3bd9181ea35c32993d1550591fd19720b31065f6";
     sha256 = "1sbdcxddpa33gqmly4x5gz2l4vhmab8hwjngpibmqfr1ga6v56wv";
     cargoSha256 = "sha256:1ls4524519jqqw42q2jsj5bxcmf1vn8hmgjzywffca2ycmvd788p";
     bins = {
       holochain = "holochain";
       hc = "hc";
     };
    };
    holochainOtherDepsNames = ["lair-keystore"];
  };
in holonix.main
