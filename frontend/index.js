import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Wallet } from "./near-wallet";
import { Contract } from "./near-interface";

import { parseSolutionSeedPhrase, mungeBlockchainCrossword } from "./utils";
// const reactRoot = createRoot(document.querySelector("#root"));

// create the Wallet and the Contract
const contractId = process.env.CONTRACT_NAME || "crossword.sunroz.testnet";
const wallet = new Wallet({ contractId: contractId });
const contract = new Contract({ wallet: wallet });

let solutionHash;
let data;

window.onload = wallet
  .startUp()
  .then(async (isSignedIn) => {
    const chainData = await contract.getUnsolvedPuzzles();
    if (chainData.puzzles.length) {
      solutionHash = chainData.puzzles[0]["solution_hash"];
      data = mungeBlockchainCrossword(chainData.puzzles);
      console.log(data);
    } else {
      console.log("Oof, there's no crossword to play right now, friend.");
    }
    return isSignedIn;
  })
  .then((isSignedIn) => {
    ReactDOM.render(
      <App
        isSignedIn={isSignedIn}
        contract={contract}
        wallet={wallet}
        solutionHash={solutionHash}
        data={data}
      />,
      document.getElementById("root")
    );
  })
  .catch((e) => {
    ReactDOM.render(
      <div style={{ color: "red" }}>
        Error: <code>{e.message}</code>
      </div>,
      document.getElementById("root")
    );
    console.error(e);
  });
