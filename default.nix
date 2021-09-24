let
  holonixPath = builtins.fetchTarball https://github.com/holochain/holonix/archive/6ae8ffb8e5c1a1faa4f4e1af8a9f7139b2ce0f3c.tar.gz;
  holonix = import (holonixPath) {
    includeHolochainBinaries = true;
    holochainVersionId = "custom";

    holochainVersion = {
      rev = "a1206a694fe3b521440fe633db99a50b8255c1b2";
      sha256 = "0qdjjkqw3xlg8g686gvn509a9rv4kc6qfw07hypzc0fksix9d4iz";
      cargoSha256 = "175b76j31sls0gj08imchwnk7n4ylsxlc1bm58zrhfmq62hcchb1";
      bins = {
        holochain = "holochain";
        hc = "hc";
      };

      lairKeystoreHashes = {
        sha256 = "1jiz9y1d4ybh33h1ly24s7knsqyqjagsn1gzqbj1ngl22y5v3aqh";
        cargoSha256 = "0agykcl7ysikssfwkjgb3hfw6xl0slzy38prc4rnzvagm5wd1jjv";
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