const { expect } = require("chai");

describe("ChampionFactory contract", function () {
  let Token;
  let contract;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  async function addChampionHelper() {
    await contract.addChampion("Rassellina", 100, 20, 0, [
      "idle",
      "attack",
      "hurt",
      "dying",
      "dead",
    ]);
  }

  beforeEach(async function () {
    Token = await ethers.getContractFactory("ChampionFactory");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    contract = await Token.deploy();

    await contract.deployed();
  });

  describe("Game", function () {
    it("owner should be able to add champions", async function () {
      await addChampionHelper();

      const championList = await contract.getChampionList();
      expect(championList.length).to.equal(1);
    });

    it("should return error if not owner try to add champions", async function () {
      const result = contract
        .connect(addr1)
        .addChampion("Rassellina", 100, 20, 0, [
          "idle",
          "attack",
          "hurt",
          "dying",
          "dead",
        ]);

      await expect(result).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
  });
});
