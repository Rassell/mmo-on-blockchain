async function main() {
  const gameContractFactory = await hre.ethers.getContractFactory("MMOGame");
  const gameContract = await gameContractFactory.attach(
    "0x62477EB1c7d1e8b6512E1D7Da266cf4175696A12"
  );
  await gameContract.addChampion("Rassellina", 100, 20, 10, [
    "https://i.imgur.com/UnWkZDq.gif",
    "https://i.imgur.com/0uefgj4.gif",
    "https://i.imgur.com/gzrIxJn.gif",
    "https://i.imgur.com/yWYLkdT.gif",
    "https://i.imgur.com/yBAI5FJ.gif",
  ]);
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
