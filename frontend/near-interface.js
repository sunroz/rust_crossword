export class Contract {
  wallet;

  constructor({ wallet }) {
    this.wallet = wallet;
  }

  async getSolution() {
    return await this.wallet.viewMethod({ method: "get_solution" });
  }

  async guessSolution(solution) {
    return await this.wallet.callMethod({
      method: "guess_solution",
      args: { solution: solution },
    });
  }
}
