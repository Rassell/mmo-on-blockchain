const { expect } = require("chai");

describe("Arena contract", function () {
  let ArenaContractFactory;
  let ChampionFactoryContractFactory;
  let BossFactoryContractFactory;
  let RosterContractFactory;
  let championFactoryContract;
  let bossFactoryContract;
  let rosterContract;
  let contract;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  async function addChampionHelper() {
    await championFactoryContract.addChampion("Rassellina", 100, 20, 0, [
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
    ArenaContractFactory = await ethers.getContractFactory("Arena");
    ChampionFactoryContractFactory = await ethers.getContractFactory(
      "ChampionFactory"
    );
    BossFactoryContractFactory = await ethers.getContractFactory("BossFactory");
    RosterContractFactory = await ethers.getContractFactory("Roster");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    contract = await ArenaContractFactory.deploy();
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

  describe("Arena", function () {
    xit("should be able to accept new player", async function () {
      await addChampionToRosterHelper();

      await contract.addChampionToArena();

      const arenaChampionList = await contract.getArenaChampionList();
      console.log(arenaChampionList);
      expect(arenaChampionList.length).to.equal(1);
    });

    it("should not allow player to join arena with dead champion", async function () {
      await addChampionToRosterHelper();

      const result = contract.addChampionToArena();

      expect(result).to.be.revertedWith(
        "Champion is dead, cannot add to arena"
      );
    });

    xit("should not allow same player to join arena with same champion", async function () {
      await addChampionToRosterHelper();

      await contract.addChampionToArena();
      const result = contract.addChampionToArena();

      expect(result).to.be.revertedWith("Champion already in arena");
    });

    it('should add boss if arena "starts"', async function () {
      await addBossHelper();

      const arena = await contract.getArena();
      expect(arena[0]).to.not.be.undefined;
      expect(arena[0]).to.not.be.null;
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
