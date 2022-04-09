async function main() {
  const gameContractFactory = await hre.ethers.getContractFactory("ChampionFactory");
  const gameContract = await gameContractFactory.attach(
    "0x885cbD739bf5A87CEb7eCF3dfa7193c4628974a6"
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
