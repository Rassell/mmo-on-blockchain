async function main() {
  const gameContractFactory = await ethers.getContractFactory("MMOGame");
  const gameContract = await gameContractFactory.deploy();
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
