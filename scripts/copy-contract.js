const fs = require("fs");
const path = require("path");

const contractsDir = path.join(__dirname, "/../client/src/assets");

if (!fs.existsSync(contractsDir)) {
  fs.mkdirSync(contractsDir);
}

fs.copyFileSync(
  path.join(__dirname, "/../artifacts/contracts/MMOGame.sol/MMOGame.json"),
  contractsDir + "/MMOGame.json"
);
