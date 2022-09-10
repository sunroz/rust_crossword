# Build (for Windows it's build.bat)

./build.sh

# Create fresh account if you wish, which is good practice

near delete crossword.sunroz.testnet sunroz.testnet
near create-account crossword.sunroz.testnet --masterAccount sunroz.testnet

# Deploy

near deploy crossword.sunroz.testnet --wasmFile ./contract/target/wasm32-unknown-unknown/release/crossword.wasm \
 --initFunction 'new' \
 --initArgs '{"solution": "69c2feb084439956193f4c21936025f14a5a5a78979d67ae34762e18a7206a0f"}'

near view crossword.sunroz.testnet get_solution

near call crossword.sunroz.testnet guess_solution '{"solution": "near nomicon ref finance"}' --accountId sunroz.testnet
