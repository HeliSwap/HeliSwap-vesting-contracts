import { ethers } from "hardhat";

async function main() {
  const beneficientAddress = "0x8FcE67537676879Bc5a1B86B403400E1614Bfce6";
  const timestampStart = ethers.BigNumber.from("1671102000"); // in 36 mins from now
  const durationSeconds = ethers.BigNumber.from("1800"); // 30 mins
  const cliffPeriod = ethers.BigNumber.from("150");

  const TokenVesting = await ethers.getContractFactory('TokenVesting');
  const tokenVesting = await TokenVesting.deploy(beneficientAddress, timestampStart, durationSeconds,cliffPeriod);
  const address = (await tokenVesting.deployTransaction.wait()).contractAddress
  console.log("TokenVesting address: ", address); // TokenVesting address:  0x5F3b5D46463dE27b28D877328bf1B4D93D974635
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
