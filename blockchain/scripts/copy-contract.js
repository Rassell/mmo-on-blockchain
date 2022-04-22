const fs = require("fs");
const path = require("path");

const contractsDir = path.join(__dirname, "/../../client/src/assets");

if (!fs.existsSync(contractsDir)) {
  fs.mkdirSync(contractsDir);
}

[
  path.join(__dirname, "/../artifacts/contracts/MMOGame.sol/MMOGame.json"),
  path.join(__dirname, "/../artifacts/contracts/Arena.sol/Arena.json"),
  path.join(
    __dirname,
    "/../artifacts/contracts/BossFactory.sol/BossFactory.json"
  ),
  path.join(
    __dirname,
    "/../artifacts/contracts/ChampionFactory.sol/ChampionFactory.json"
  ),
  path.join(__dirname, "/../artifacts/contracts/Roster.sol/Roster.json"),
].forEach((file) =>
  fs.copyFileSync(file, path.join(contractsDir, file.split("/").pop()))
);
