// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const NFT = await hre.ethers.getContractFactory("FlokinomicsNFT");
  const nft = await NFT.deploy();

  await nft.deployed();

  // await hre.run("verify:verify", {
  //   address: nft.address,
  //   contract: "contracts/FlokinomicsNFT.sol:FlokinomicsNFT",
  // });

  // We get the contract to deploy
  const Marketplace = await hre.ethers.getContractFactory("FlokinomicsNFTMarketplace");
  const accounts = await hre.ethers.getSigners();

  const marketplace = await Marketplace.deploy(
    nft.address,
    "0x094616f0bdfb0b526bd735bf66eca0ad254ca81f", // Wrapped Testnet BNB address
    accounts[0].address, // Admin recover address (testnet)
    "0xd683eb2F7214Ef5a86A1815Ad431410ddD45BAbb", // Payable address
    // "0x97ea5efdcb5961a99ba5c96123042507c0210ec1" // Testnet Flokin address (not yet)
  );

  await marketplace.deployed();

  // await hre.run("verify:verify", {
  //   address: marketplace.address,
  //   constructorArguments: [
  //     nft.address,
  //     "0x094616f0bdfb0b526bd735bf66eca0ad254ca81f",
  //     accounts[0].address,
  //     "0xd683eb2F7214Ef5a86A1815Ad431410ddD45BAbb",
  //     // "0x97ea5efdcb5961a99ba5c96123042507c0210ec1",
  //   ],
  //   contract: "contracts/Marketplace.sol:FlokinomicsNFTMarketplace",
  // });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
