import { ethers } from "hardhat";

async function main() {
  const MockERC20 = await ethers.getContractFactory('MockERC20');
  const mockERC20 = await MockERC20.deploy();
  const address = (await mockERC20.deployTransaction.wait()).contractAddress
  console.log("MockERC20 address: ", address); // MockERC20 goerli address:  0x9f1306D041f1B6c66a02Bbc7A4cC4bEcbad45Eed
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});