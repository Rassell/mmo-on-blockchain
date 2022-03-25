const { expect } = require("chai");

describe("MMO Game contract", function () {
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
    Token = await ethers.getContractFactory("MMOGame");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    contract = await Token.deploy();

    await contract.deployed();
  });

  describe("Champion", function () {
    it("should be able to attack", async function () {
      //TODO: Logic to add champions to player, or mock it?

      await contract
        .attack()
        .to.emit(contract, "AttackStarted")
        .and.to.emit(contract, "AttackComplete")
        .withArgs(1, 42);
    });

    it("should be able to heal", async function () {
      await contract
        .heal()
        .to.emit(contract, "HealStarted")
        .and.to.emit(contract, "HealComplete")
        .withArgs(1, 1);
    });

    it("should notify user if health reach 0", async function () {
      await contract.heal().to.emit(contract, "BossHealthChanged").withArgs(0);
    });

    it("should not be able to do anyhitng if health is 0", async function () {
      await contract
        .attack()
        .to.emit(contract, "AttackComplete")
        .withArgs(0, 0);
    });

    it("should emit event players arena finished", async function () {
      await addChampionToRosterHelper();
      await addBossHelper(1);
      await contract.addChampionToArena();

      await expect(contract.attack()).to.emit(contract, "ArenaFinished");
    });
  });

  describe("Boss", function () {
    it("should be able to attack random", async function () {
      await contract
        .attack()
        .to.emit(contract, "BossAttackComplete")
        .withArgs(1, 25);
    });
  });
});
