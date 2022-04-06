async function main() {
  const gameContractFactory = await ethers.getContractFactory("MMOGame");
  console.log("Factory initialized");
  const gameContract = await gameContractFactory.deploy();
  console.log("Deploying contract");
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);
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
