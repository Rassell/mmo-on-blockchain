async function main() {
  // const championFactoryContractAddress = await deployChampionFactoryContract();
  // const bossFactoryContractAddress = await deployBossFactoryContract();
  const rosterContractAddress = await deployRosterContract(
    "0x885cbD739bf5A87CEb7eCF3dfa7193c4628974a6"
  );

  await deployMMOContract(
    "0x9af180C5FC03Fd9c0a1F0Bec34111cF498c71c7c",
    rosterContractAddress
  );
}

async function deployChampionFactoryContract() {
  const championFactoryContractFactory = await ethers.getContractFactory(
    "ChampionFactory"
  );
  console.log("Champion Factory initialized");
  const ChampionFactoryContract = await championFactoryContractFactory.deploy();
  console.log("Deploying Champion Factory contract");
  await ChampionFactoryContract.deployed();
  console.log("Contract deployed to:", ChampionFactoryContract.address);
  return ChampionFactoryContract.address;
}

async function deployBossFactoryContract() {
  const bossFactoryContractFactory = await ethers.getContractFactory(
    "BossFactory"
  );
  console.log("Boss Factory initialized");
  const BossFactoryContract = await bossFactoryContractFactory.deploy();
  console.log("Deploying Boss Factory contract");
  await BossFactoryContract.deployed();
  console.log("Contract deployed to:", BossFactoryContract.address);
  return BossFactoryContract.address;
}

async function deployRosterContract(championFactoryContractAddress) {
  const RosterContractFactory = await ethers.getContractFactory("Roster");
  console.log("Roster initialized");
  const RosterContract = await RosterContractFactory.deploy();
  console.log("Deploying Roster contract");
  await RosterContract.deployed();
  console.log("Contract deployed to:", RosterContract.address);
  await RosterContract.setChampionFactory(championFactoryContractAddress);
  return RosterContract.address;
}

async function deployMMOContract(
  bossFactoryContractAddress,
  rosterFactoryContractAddress
) {
  const gameContractFactory = await ethers.getContractFactory("MMOGame");
  console.log("MMO Factory initialized");
  const gameContract = await gameContractFactory.deploy();
  console.log("Deploying MMO contract");
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);
  await gameContract.setBossFactory(bossFactoryContractAddress);
  await gameContract.setRoster(rosterFactoryContractAddress);
  console.log("Contracts set");
}

async function runMain() {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

runMain();
