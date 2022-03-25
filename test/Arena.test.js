const { expect } = require("chai");

describe("Arena contract", function () {
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

  async function addBossHelper(bossHealth = 100) {
    await contract.addBoss("SuperBoss", bossHealth, 20, [
      "idle",
      "attack",
      "hurt",
      "dying",
      "dead",
    ]);
  }

  async function addChampionToRosterHelper() {
    await addChampionHelper();

    await contract.addChampionToRoster(0);
    await contract.setSelectChampion(0);
  }

  beforeEach(async function () {
    Token = await ethers.getContractFactory("Arena");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    contract = await Token.deploy();

    await contract.deployed();
  });

  describe("Arena", function () {
    it("should be able to accept new player", async function () {
      await addChampionToRosterHelper();

      await contract.addChampionToArena();

      const arenaChampionList = await contract.getArenaChampionList();
      expect(arenaChampionList.length).to.equal(1);
    });

    it("should not allow player to join arena with dead champion", async function () {
      await addChampionToRosterHelper();

      const result = contract.addChampionToArena();

      expect(result).to.be.revertedWith(
        "Champion is dead, cannot add to arena"
      );
    });

    it("should not allow same player to join arena with same champion", async function () {
      await addChampionToRosterHelper();

      await contract.addChampionToArena();
      const result = contract.addChampionToArena();

      expect(result).to.be.revertedWith("Champion already in arena");
    });

    it('should add boss if arena "starts"', async function () {
      await addBossHelper();

      const boss = await contract.getArenaBoss();
      expect(boss).to.not.be.undefined;
      expect(boss).to.not.be.null;
    });

    it("should emit event players when arena started", async function () {
      await addChampionToRosterHelper();
      await addBossHelper();

      await expect(contract.addChampionToArena())
        .to.emit(contract, "ArenaStarted")
        .withArgs(0);
    });

    it("should emit event players when new champion added", async function () {
      await addChampionToRosterHelper();
      await addBossHelper();

      await expect(contract.addChampionToArena())
        .to.emit(contract, "ArenaNewChampion")
        .withArgs(1);
    });
  });
});
