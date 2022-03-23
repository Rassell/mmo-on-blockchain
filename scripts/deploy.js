const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
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
    "https://i1.wp.com/blogactual.cl/wp-content/uploads/2021/09/640-1410205121176-edited.jpg", // Boss image
    10000, // Boss hp
    50 // Boss attack damage
  );

  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);
//
//  let txn;
//  // We only have three characters.
//  // an NFT w/ the character at index 2 of our array.
//  txn = await gameContract.mintCharacterNFT(2);
//  await txn.wait();
//
//  txn = await gameContract.attackBoss();
//  await txn.wait();
//
//  txn = await gameContract.attackBoss();
//  await txn.wait();
//
//  console.log("Done!");
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