const { expect } = require("chai");

describe("MMO Game contract", function () {
  let Token;
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("MMOGame");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    hardhatToken = await Token.deploy();

    await hardhatToken.deployed();
  });

  describe("Game", function () {
    it("Should be able to add champions", async function () {
      await hardhatToken.addChampion(
        "Rassellina",
        "https://i.imgur.com/mYzsTDT.png",
        100,
        100
      );

      const championList = await hardhatToken.getChampionList();
      expect(championList.length).to.equal(1);
    });
  });

  describe("Player", function () {
    it("should be able to see all champions", async function () {
      const rosterList = await hardhatToken.getRosterList();
      expect(rosterList.length).to.equal(0);
    });

    it("should be able to check if have any champion", async function () {
      let hasRoster = await hardhatToken.checkIfUserHasRoster();

      expect(hasRoster).to.equal(false);
    });

    it("should be able to add champion to his roster", async function () {
      await hardhatToken.addChampionToRoster(0);
      await hardhatToken.addChampionToRoster(1);

      const rosterList = await hardhatToken.getRosterList();
      expect(rosterList.length).to.equal(2);
    });

    it("should be able to select a champion", async function () {
      await hardhatToken.addChampionToRoster(0);
      await hardhatToken.addChampionToRoster(1);

      await hardhatToken.selectChampion(0);

      const selectedChampion = await hardhatToken.getSelectedChampion();
      expect(selectedChampion).to.equal(0);
    });
  });

  describe("Arena", function () {
    it("should be able to accept new player", async function () {
      //TODO: Logic to add champions to player

      await hardhatToken.addChampionToArena(0);
      await hardhatToken.addChampionToRoster(1);

      const arenaChampionList = await hardhatToken.getArenaChampions();
      expect(arenaChampionList.length).to.equal(0);
    });

    it('should add boss if arena "starts"', async function () {
      let boss = await hardhatToken.getArenaBoss();
      expect(boss).to.equal(0);

      //TODO: Logic to add champions to player, or mock it?
      await hardhatToken.addChampionToArena(0);

      boss = await hardhatToken.getArenaBoss();
      expect(boss).to.equal(1);
    });

    it("should add more health to the boss as more users enters the arena", async function () {
      const baseBossHealth = 100;

      //TODO: Logic to add champions to player, or mock it?
      const boss = await hardhatToken.getArenaBoss();
      expect(boss.health).to.equal(100);

      boss = await hardhatToken.getArenaBoss();
      const arenaChampionList = await hardhatToken.getArenaChampions();
      expect(boss).to.equal(arenaChampionList.length * baseBossHealth);
    });

    it("should notify players arena finished", async function () {
      await hardhatToken
        .attack()
        .to.emit(hardhatToken, "AttackComplete")
        .withArgs(1, 42);
    });
  });

  describe("Champion", function () {
    it("should be able to attack", async function () {
      //TODO: Logic to add champions to player, or mock it?

      await hardhatToken
        .attack()
        .to.emit(hardhatToken, "AttackComplete")
        .withArgs(1, 42);
    });

    it("should be able to heal", async function () {
      await hardhatToken
        .heal()
        .to.emit(hardhatToken, "HealComplete")
        .withArgs(1, 1);
    });

    it("should notify user if health reach 0", async function () {
      await hardhatToken
        .heal()
        .to.emit(hardhatToken, "BossHealthChanged")
        .withArgs(0);
    });

    it("should not be able to do anyhitng if health is 0", async function () {
      await hardhatToken
        .attack()
        .to.emit(hardhatToken, "AttackComplete")
        .withArgs(0, 0);
    });
  });

  describe("Boss", function () {
    it("should be able to attack random", async function () {
      await hardhatToken
        .attack()
        .to.emit(hardhatToken, "BossAttackComplete")
        .withArgs(1, 25);
    });
  });
});
