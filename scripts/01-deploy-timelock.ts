import { ethers } from "hardhat";

export async function deployTimelock() {
  const minDelay = ethers.BigNumber.from("10");
  const proposers = ["0.0.1017", "0.0.7951"];
  const executors = ["0.0.10754", "0.0.15819"];
  const admin = "0.0.16998";
  const Timelock = await ethers.getContractFactory("Timelock");
  const timelock = await Timelock.deploy(minDelay, proposers, executors, admin);
  const address = (await timelock.deployTransaction.wait()).contractAddress;
  console.log("Timelock address: ", address);
}

module.exports = deployTimelock;