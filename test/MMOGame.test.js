const { expect } = require("chai");

describe("MMO Game contract", function () {
  let Token;
  let contract;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  async function addChampionHelper() {
    await contract.addChampion("Rassellina", 100, 20, 10, [
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
    Token = await ethers.getContractFactory("MMOGame");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    contract = await Token.deploy();

    await contract.deployed();
  });

  describe("Champion", function () {
    it("should be able to attack", async function () {
      await addChampionToRosterHelper();
      await addBossHelper();
      await contract.addChampionToArena();

      await expect(contract.attack())
        .to.emit(contract, "AttackComplete")
        .withArgs(80);
    });

    it("should be able to heal", async function () {
      await addChampionToRosterHelper();
      await addBossHelper();
      await contract.addChampionToArena();

      await expect(contract.heal())
        .to.emit(contract, "HealComplete")
        .withArgs(110);
    });

    it("should not be able to do anyhitng if no champion is in the arena", async function () {
      await expect(contract.attack()).to.be.revertedWith(
        "User has not a champion in the arena"
      );
    });

    it("should emit event players arena finished", async function () {
      await addChampionToRosterHelper();
      await addBossHelper(1);
      await contract.addChampionToArena();

      await expect(contract.attack()).to.emit(contract, "ArenaFinished");
    });
  });

  describe("Boss", function () {
    it("should be able to attack the attacker", async function () {
      await addChampionToRosterHelper();
      await addBossHelper();
      await contract.addChampionToArena();

      await expect(contract.attack())
        .to.emit(contract, "BossAttackComplete")
        .withArgs(1, 80);
    });
  });
});
