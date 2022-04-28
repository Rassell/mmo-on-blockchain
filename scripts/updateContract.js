async function main() {
  const gameContractFactory = await hre.ethers.getContractFactory("MMOGame");
  console.log("MMO Factory initialized");
  const gameContract = await gameContractFactory.attach(
    "0x65CE10026F0930be42557FB20D074CE56cfA69cE"
  );
  console.log("Attached MMO contract");
  await gameContract.setRoster("0xF9A2068390403bA796F5cDe72C5b99ba82AFb51e");
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
