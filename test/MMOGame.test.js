const { expect } = require("chai");

describe("MMO Game contract", function () {
  let Token;
  let contract;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("MMOGame");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    contract = await Token.deploy();

    await contract.deployed();
  });

  describe("Game", function () {
    it("owner should be able to add champions", async function () {
      await contract.addChampion("Rassellina", 100, 20, 0, [
        "idle",
        "attack",
        "hurt",
        "dying",
        "dead",
      ]);

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
      let hasRoster = await contract.checkIfUserHasRoster();

      expect(hasRoster).to.equal(false);
    });

    it("should be able to add champion to his roster", async function () {
      await contract.addChampionToRoster(0);
      await contract.addChampionToRoster(1);

      const rosterList = await contract.getRosterList();
      expect(rosterList.length).to.equal(2);
    });

    it("should be able to select a champion", async function () {
      await contract.addChampionToRoster(0);
      await contract.addChampionToRoster(1);

      await contract.selectChampion(0);

      const selectedChampion = await contract.getSelectedChampion();
      expect(selectedChampion).to.equal(0);
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
