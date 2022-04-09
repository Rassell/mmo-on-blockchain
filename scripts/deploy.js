async function main() {
  // const championFactoryContractAddress = await deployChampionFactoryContract();
  // const bossFactoryContractAddress = await deployBossFactoryContract();

  await deployMMOContract(
    "0x885cbD739bf5A87CEb7eCF3dfa7193c4628974a6",
    "0x9af180C5FC03Fd9c0a1F0Bec34111cF498c71c7c"
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

async function deployMMOContract(
  championFactoryContractAddress,
  bossFactoryContractAddress
) {
  const gameContractFactory = await ethers.getContractFactory("MMOGame");
  console.log("MMO Factory initialized");
  const gameContract = await gameContractFactory.deploy();
  console.log("Deploying MMO contract");
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);
  await gameContract.setChampionFactory(championFactoryContractAddress);
  await gameContract.setBossFactory(bossFactoryContractAddress);
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
