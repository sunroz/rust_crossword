import "regenerator-runtime/runtime";
import React, { useCallback, useRef, useState } from "react";
import Crossword from "react-crossword-near";
import { createGridData, loadGuesses } from "react-crossword-near/dist/es/util";
import sha256 from "js-sha256";
import { parseSolutionSeedPhrase } from "./utils";

import "./assets/global.css";

export default function App({ contract, wallet, isSignedIn, hash, data }) {
  const crossword = useRef();
  const [solutionFound, setSolutionFound] = useState(false);
  const [uiPleaseWait, setUiPleaseWait] = React.useState(true);
  const [solutionHash, setSolutionHash] = useState(hash);
  const [transactionHash, setTransactionHash] = useState(false);

  // Get blockchian state once on component load
  /*  React.useEffect(() => {
    // contract
    //   .getUnsolvedPuzzles()
    //   .then((chainData) => {
    //     console.log("chainData");
    //     console.log(chainData);
    //     // There may not be any crossword puzzles to solve, check this.
    //     if (chainData.puzzles.length) {
    //       const solutionHash = chainData.puzzles[0]["solution_hash"];
    //       const data = mungeBlockchainCrossword(chainData.puzzles);
    //       console.log(data);
    //       setSolutionHash(solutionHash);
    //       setData(data);
    //     } else {
    //       console.log("Oof, there's no crossword to play right now, friend.");
    //     }
    //   })
    //   .catch(alert)
    //   .finally(() => {
    //     setUiPleaseWait(false);
    //   });
  }, []); */

  const onCrosswordComplete = useCallback(async (completeCount) => {
    console.log("onCrosswordComplete");
    if (completeCount !== false) {
      let gridData = createGridData(data).gridData;
      loadGuesses(gridData, "guesses");
      await checkSolution(gridData);
    }
  }, []);

  // This function is called when all entries are filled
  async function checkSolution(gridData) {
    console.log("checkSolution");
    let seedPhrase = parseSolutionSeedPhrase(data, gridData);
    let answerHash = sha256.sha256(seedPhrase);
    console.log("solutionHash", solutionHash);
    console.log("answerHash", answerHash);
    // Compare crossword solution's public key with the known public key for this puzzle
    // (It was given to us when we first fetched the puzzle in index.js)
    if (answerHash === solutionHash) {
      console.log("You're correct!");
      setSolutionFound("Correct!");

      // Clean up and get ready for next puzzle
      localStorage.removeItem("guesses");
      setSolutionHash(null);

      let functionCallResult = await contract.submitSolution(
        seedPhrase,
        "Yay I won!"
      );

      if (
        functionCallResult &&
        functionCallResult.transaction &&
        functionCallResult.transaction.hash
      ) {
        console.log(
          "Transaction hash for explorer",
          functionCallResult.transaction.hash
        );
        setTransactionHash(functionCallResult.transaction.hash);
      }
    } else {
      console.log("That's not the correct solution. :/");
      setSolutionFound("Not correct yet");
    }
  }

  return (
    <>
      <main className={uiPleaseWait ? "please-wait" : ""}>
        <div id="page">
          <h1>NEAR Crossword Puzzle</h1>
          <div id="crossword-wrapper">
            <div id="login">
              {isSignedIn ? (
                <button onClick={() => wallet.signOut()}>Log out</button>
              ) : (
                <button onClick={() => wallet.signIn()}>Log in</button>
              )}
            </div>
            <h3>Status: {solutionFound}</h3>
            {isSignedIn && (
              <Crossword
                data={data}
                ref={crossword}
                onCrosswordComplete={onCrosswordComplete}
              />
            )}
            <p>
              Thank you{" "}
              <a
                href="https://github.com/JaredReisinger/react-crossword"
                target="_blank"
                rel="noreferrer"
              >
                @jaredreisinger/react-crossword
              </a>
              !
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
