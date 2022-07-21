const Migrations = artifacts.require("Warranty");
const fs = require("fs/promises")
module.exports = async function (deployer) {
  await deployer.deploy(Migrations);
  let dataJson = JSON.parse(await fs.readFile("../src/artifacts/contracts/Warranty.json", { encoding: 'ascii' }))
  let abi = dataJson.abi
  let networks = dataJson.networks
  await fs.writeFile("../src/artifacts/contracts/Warranty_less_data.json", JSON.stringify({ abi, networks }))
};
