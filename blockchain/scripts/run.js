const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
  const gameContract = await gameContractFactory.deploy(
    ["Rassellina", "Rasswarr", "Rassbarb"], // Names
    [
      "https://i.imgur.com/mYzsTDT.png", // Images
      "https://i.imgur.com/Wd1etd7.png",
      "https://i.imgur.com/nHDvITj.png",
    ],
    [100, 200, 150], // HP values
    [100, 50, 75], // Attack damage values
    "Tottally not Elon Musk", // Boss name
    "https://i.imgur.com/AksR0tt.png", // Boss image
    10000, // Boss hp
    50 // Boss attack damage
  );
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);

  let txn;
  txn = await gameContract.mintCharacterNFT(2);
  await txn.wait();

  txn = await gameContract.attackBoss();
  await txn.wait();

  txn = await gameContract.attackBoss();
  await txn.wait();
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
