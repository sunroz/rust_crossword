import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Wallet } from "./near-wallet";
import { Contract } from "./near-interface";
import { data } from "./hardcoded-data";

// const reactRoot = createRoot(document.querySelector("#root"));

// create the Wallet and the Contract
const contractId = process.env.CONTRACT_NAME;
const wallet = new Wallet({ contractId: contractId });
const contract = new Contract({ wallet: wallet });

window.onload = wallet
  .startUp()
  .then((isSignedIn) => {
    ReactDOM.render(
      <App
        isSignedIn={isSignedIn}
        contract={contract}
        wallet={wallet}
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
