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

  describe("Game", function () {
    it("owner should be able to add champions", async function () {
      await addChampionHelper();

      const championList = await contract.getChampionList();
      expect(championList.length).to.equal(1);
    });

    it("owner should be able to add bosses", async function () {
      await addBossHelper();

      const bossList = await contract.getBossList();
      expect(bossList.length).to.equal(1);
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

  describe("Player", function () {
    it("should be able to check if have any champion", async function () {
      let hasRoster = await contract.userHasRoster();

      expect(hasRoster).to.equal(false);
    });

    it("should be able to add champion to his roster", async function () {
      await addChampionHelper();

      await contract.addChampionToRoster(0);
      await contract.addChampionToRoster(0);

      const rosterList = await contract.getUserRoster();
      expect(rosterList.length).to.equal(2);
    });

    it("should be able to select a champion", async function () {
      await addChampionHelper();

      await contract.addChampionToRoster(0);
      await contract.addChampionToRoster(0);

      await contract.setSelectChampion(0);

      const selectedChampion = await contract.getSelectedChampion();
      expect(selectedChampion).to.be.not.undefined;
      expect(selectedChampion).to.be.not.null;
    });

    it("should emit event when adding a champion", async function () {
      await addChampionHelper();

      await expect(contract.addChampionToRoster(0))
        .to.emit(contract, "ChampionAddedToRoster")
        .withArgs(owner.address, 1, 0);
    });

    it("should emit event when selecting a champion", async function () {
      await addChampionHelper();

      await contract.addChampionToRoster(0);

      await expect(contract.setSelectChampion(0))
        .to.emit(contract, "ChampionSelected")
        .withArgs(owner.address, 1);
    });
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

    it("should emit event players arena finished", async function () {
      await addChampionToRosterHelper();
      await addBossHelper(1);
      await contract.addChampionToArena();

      await expect(contract.attack()).to.emit(contract, "ArenaFinished");
    });
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
