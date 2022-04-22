const { expect } = require("chai");

describe("BossFactory contract", function () {
  let Token;
  let contract;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  async function addBossHelper(bossHealth = 100) {
    await contract.addBoss("SuperBoss", bossHealth, 20, [
      "idle",
      "attack",
      "hurt",
      "dying",
      "dead",
    ]);
  }

  beforeEach(async function () {
    Token = await ethers.getContractFactory("BossFactory");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    contract = await Token.deploy();

    await contract.deployed();
  });

  describe("Game", function () {
    it("owner should be able to add bosses", async function () {
      await addBossHelper();

      const bossList = await contract.getBossList();
      expect(bossList.length).to.equal(1);
    });

    it("should return error if not owner try to add bosses", async function () {
      const result = contract
        .connect(addr1)
        .addBoss("Rassellina", 100, 20, [
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
