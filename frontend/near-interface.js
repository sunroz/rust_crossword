export class Contract {
  wallet;

  constructor({ wallet }) {
    this.wallet = wallet;
  }

  async getSolution(puzzle_index) {
    return await this.wallet.viewMethod({
      method: "get_solution",
      args: { puzzle_index: puzzle_index },
    });
  }

  async getPuzzleStatus(solution_hash) {
    return await this.wallet.viewMethod({
      method: "get_puzzle_status",
      args: { solution_hash: solution_hash },
    });
  }

  async getUnsolvedPuzzles() {
    return await this.wallet.viewMethod({ method: "get_unsolved_puzzles" });
  }

  async submitSolution(solution, memo) {
    return await this.wallet.callMethod({
      method: "submit_solution",
      args: { solution: solution, memo: memo },
    });
  }

  async newPuzzle(solution_hash, answers) {
    return await this.wallet.callMethod({
      method: "new_puzzle",
      args: { solution_hash: solution_hash, answers: answers },
    });
  }
}
