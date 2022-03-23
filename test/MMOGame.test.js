const { expect } = require("chai");

describe("MMO Game contract", function () {
  let Token;
  let contract;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  async function addChampion() {
    await contract.addChampion("Rassellina", 100, 20, 0, [
      "idle",
      "attack",
      "hurt",
      "dying",
      "dead",
    ]);
  }

  beforeEach(async function () {
    Token = await ethers.getContractFactory("MMOGame");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    contract = await Token.deploy();

    await contract.deployed();
  });

  describe("Game", function () {
    it("owner should be able to add champions", async function () {
      await addChampion();

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

  describe("Player", function () {
    it("should be able to check if have any champion", async function () {
      let hasRoster = await contract.userHasRoster();

      expect(hasRoster).to.equal(false);
    });

    it("should be able to add champion to his roster", async function () {
      await addChampion();

      await contract.addChampionToRoster(0);
      await contract.addChampionToRoster(0);

      const rosterList = await contract.getUserRoster();
      expect(rosterList.length).to.equal(2);
    });

    it("should be able to select a champion", async function () {
      await addChampion();

      await contract.addChampionToRoster(0);
      await contract.addChampionToRoster(0);

      await contract.setSelectChampion(0);

      const selectedChampion = await contract.getSelectedChampion();
      expect(selectedChampion).to.be.not.undefined;
      expect(selectedChampion).to.be.not.null;
    });

    it("should emit event when adding a champion", async function () {
      await addChampion();

      await expect(contract.addChampionToRoster(0))
        .to.emit(contract, "ChampionAddedToRoster")
        .withArgs(owner.address, 1, 0);
    });

    it("should emit event when selecting a champion", async function () {
      await addChampion();

      await contract.addChampionToRoster(0);

      await expect(contract.setSelectChampion(0))
        .to.emit(contract, "ChampionSelected")
        .withArgs(owner.address, 1);
    });
  });

  describe("Arena", function () {
    it("should be able to accept new player", async function () {
      //TODO: Logic to add champions to player

      await contract.addChampionToArena(0);
      await contract.addChampionToRoster(1);

      const arenaChampionList = await contract.getArenaChampions();
      expect(arenaChampionList.length).to.equal(0);
    });

    it('should add boss if arena "starts"', async function () {
      let boss = await contract.getArenaBoss();
      expect(boss).to.equal(0);

      //TODO: Logic to add champions to player, or mock it?
      await contract.addChampionToArena(0);

      boss = await contract.getArenaBoss();
      expect(boss).to.equal(1);
    });

    // TODO: shoud notify users new boss health
    it("should add more health to the boss as more users enters the arena", async function () {
      const baseBossHealth = 100;

      //TODO: Logic to add champions to player, or mock it?
      const boss = await contract.getArenaBoss();
      expect(boss.health).to.equal(100);

      boss = await contract.getArenaBoss();
      const arenaChampionList = await contract.getArenaChampions();
      expect(boss).to.equal(arenaChampionList.length * baseBossHealth);
    });

    it("should notify players arena finished", async function () {
      await contract
        .attack()
        .to.emit(contract, "AttackComplete")
        .withArgs(1, 42);
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
