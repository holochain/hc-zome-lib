#############################
# █▀█ █▀▀ █░░ █▀▀ ▄▀█ █▀ █▀▀
# █▀▄ ██▄ █▄▄ ██▄ █▀█ ▄█ ██▄
#############################
# requirements
# - cargo-edit crate: `cargo install cargo-edit`
# - jq linux terminal tool : `sudo apt-get install jq`
# How to make a update?
#	- Update the version-manager.json file
# 	- make update
#	- make publish
# Publishing

publish:
	git checkout -B v$(shell jq .hdk ./version-manager.json)
	git add .
	git commit -m "version bump $(shell jq .hdk ./version-manager.json)"
	cd ./zomes/hc_iz_profile && cargo publish
	cd ./zomes/hc_iz_membrane_manager && cargo publish
	cd ./zomes/hc_cz_profile && cargo publish
	git tag $(shell jq .hdk ./version-manager.json)
	git push origin v$(shell jq .hdk ./version-manager.json)
	git push origin refs/tags/$(shell jq .hdk ./version-manager.json)

update:
	rm -f Cargo.lock
	echo '⚙️  Updating hdk, hdi & hc_utils crate...'
	cargo upgrade -p hdk@=$(shell jq .hdk ./version-manager.json) -p hdi@=$(shell jq .hdi ./version-manager.json) -p hc_utils@=$(shell jq .hdk ./version-manager.json) --pinned
	echo '⚙️  Version bump of hc_utils crate...'
	cargo set-version $(shell jq .hdk ./version-manager.json) --workspace
	# echo '⚙️  Updating holonix...'
	# nix flake update
	echo '⚙️  Building dnas and happ...'
	make nix-build
	echo '⚙️  Running tests...'
	make nix-test-dna-debug

##
# Test and build hc-zomes Project
#
# This Makefile is primarily instructional; you can simply enter the Nix environment for
# holochain development (supplied by holonix;) via `nix develop` and run
# `make test` directly, or build a target directly, eg. `nix-build -A hc-zomes`.
#
SHELL		= bash
DNANAME		= hc-zomes
DNA			= $(DNANAME).dna
WASM		= target/wasm32-unknown-unknown/release/profile.wasm

dnas:
	mkdir -p ./dnas
dnas/joining-code-factory.dna:	dnas
	curl 'https://holo-host.github.io/joining-code-happ/releases/downloads/0_6_1/joining-code-factory.0_6_1.dna' -o $@

DNAs: dnas/joining-code-factory.dna

# External targets; Uses a nix develop environment to obtain Holochain runtimes, run tests, etc.
.PHONY: all FORCE
all: nix-test

# nix-test, nix-install, ...
nix-%:
	nix develop --command bash -c "make $*"

# Internal targets; require a Nix environment in order to be deterministic.
# - Uses the version of `dna-util`, `holochain` on the system PATH.
# - Normally called from within a Nix environment, eg. run `nix develop`
.PHONY: rebuild install build build-cargo build-dna
rebuild: clean build

install: build

build: build-cargo build-dna

build: $(DNA)

# Package the DNA from the built target release WASM
$(DNA):	$(WASM) FORCE
	@echo "Packaging DNA:"
	@hc dna pack . -o ./$(DNANAME).dna
	@hc app pack . -o ./$(DNANAME).happ
	@ls -l $@

# Recompile the target release WASM
$(WASM): FORCE
	@echo "Building  DNA WASM:"
	@RUST_BACKTRACE=1 CARGO_TARGET_DIR=target cargo build \
	    --release --target wasm32-unknown-unknown

.PHONY: test test-all test-unit test-e2e test-dna test-dna-debug test-stress test-sim2h test-node
test-all: test

test: test-unit test-e2e # test-stress # re-enable when Stress tests end reliably

test-unit:
	RUST_BACKTRACE=1 cargo test \
	    -- --nocapture

test-dna: $(DNA) DNAs
	@echo "Starting Scenario tests in $$(pwd)..."; \
	    cd tests && ( [ -d  node_modules ] || npm install ) && npm test

test-dna-debug: $(DNA) DNAs
	@echo "Starting Scenario tests in $$(pwd)..."; \
	    cd tests && ( [ -d  node_modules ] || npm install ) && npm run test-debug

test-e2e: test-dna

# Generic targets; does not require a Nix environment
.PHONY: clean
clean:
	rm -rf \
	    dist \
	    tests/node_modules \
	    .cargo \
	    target \
	    Cargo.lock
