const { expect } = require("chai");

describe("MMO Game contract", function () {
  let MMOGameContractFactory;
  let ArenaContractFactory;
  let ChampionFactoryContractFactory
  let BossFactoryContractFactory
  let contract;
  let championFactoryContract;
  let bossFactoryContract;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  async function addChampionHelper() {
    await championFactoryContract.addChampion("Rassellina", 100, 20, 10, [
      "idle",
      "attack",
      "hurt",
      "dying",
      "dead",
    ]);
  }

  async function addBossHelper(bossHealth = 100) {
    await bossFactoryContract.addBoss("SuperBoss", bossHealth, 20, [
      "idle",
      "attack",
      "hurt",
      "dying",
      "dead",
    ]);
  }

  async function addChampionToRosterHelper() {
    await addChampionHelper();

    await rosterContract.addChampionToRoster(0);
    await rosterContract.setSelectChampion(0);
  }

  beforeEach(async function () {
    MMOGameContractFactory = await ethers.getContractFactory("MMOGame");
    ArenaContractFactory = await ethers.getContractFactory("Arena");
    ChampionFactoryContractFactory = await ethers.getContractFactory(
      "ChampionFactory"
    );
    BossFactoryContractFactory = await ethers.getContractFactory("BossFactory");
    RosterContractFactory = await ethers.getContractFactory("Roster");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    contract = await MMOGameContractFactory.deploy();
    arenaContract = await ArenaContractFactory.deploy();
    championFactoryContract = await ChampionFactoryContractFactory.deploy();
    bossFactoryContract = await BossFactoryContractFactory.deploy();
    rosterContract = await RosterContractFactory.deploy();

    await contract.deployed();
    await championFactoryContract.deployed();
    await bossFactoryContract.deployed();
    await rosterContract.deployed();
    await rosterContract.setChampionFactory(championFactoryContract.address);
    await contract.setRoster(rosterContract.address);
    await contract.setBossFactory(bossFactoryContract.address);
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
        .withArgs(1, 110);
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
