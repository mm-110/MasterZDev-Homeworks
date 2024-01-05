// open another terminal and run: npx hardhat node
// you can also use: ganache
// use: npx hardhat run --network localhost scripts/deploy.js

const hre = require("hardhat");

async function main() {

  const tokenName = "TokenName";
  const tokenSym = "TN";

  const Blacklist = await hre.ethers.getContractFactory("BlackList");
  const blacklist = await Blacklist.deploy();
  await blacklist.waitForDeployment();
  console.log("Blacklist deployed to:", await blacklist.getAddress());

  // Implementa il contratto Token
  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy(tokenName, tokenSym, blacklist.getAddress());
  await token.waitForDeployment();
  console.log("Token deployed to:", await token.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});