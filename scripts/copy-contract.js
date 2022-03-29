const fs = require("fs");

const contractsDir = __dirname + "/../client/src/assets";

if (!fs.existsSync(contractsDir)) {
  fs.mkdirSync(contractsDir);
}

fs.copyFileSync(
  __dirname + "/../artifacts/contracts/MMOGame.sol/MMOGame.json",
  contractsDir + "/MMOGame.json"
);
