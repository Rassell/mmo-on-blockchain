async function main() {
  const gameContractFactory = await hre.ethers.getContractFactory("MMOGame");
  const gameContract = await gameContractFactory.attach(
    "0x185e547C110d7fd6d3dC37CB979338F1692F17Ee"
  );
  await gameContract.addBoss("Rassellina", 1000, 5, [
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
