const { expect } = require("chai");

describe("Roster contract", function () {
  let RosterContractFactory;
  let ChampionFactoryContractFactory;
  let championFactoryContract;
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

  beforeEach(async function () {
    RosterContractFactory = await ethers.getContractFactory("Roster");
    ChampionFactoryContractFactory = await ethers.getContractFactory(
      "ChampionFactory"
    );
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    contract = await RosterContractFactory.deploy();
    championFactoryContract = await ChampionFactoryContractFactory.deploy();

    await contract.deployed();
    await championFactoryContract.deployed();
    await contract.setChampionFactory(championFactoryContract.address);
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
});
