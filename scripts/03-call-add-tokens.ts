// @ts-nocheck
// import hardhat from 'hardhat';

import addressesArray from './addresses.json';

import { ethers } from "hardhat";

require('dotenv').config();

async function addBeneficiaries() {
  const vestingAddress = '0x0000000000000000000000000000000002f0988A'; // bytes implementation
  const tokenVesting = await ethers.getContractAt('TokenVesting', vestingAddress);

  let beneficiaries = [];
  let balances = [];

  for (let i = 5; i < 95; i++) {
    const address = addressesArray[i].address;

    beneficiaries.push(address);
    balances.push(ethers.BigNumber.from("1"));
  }

  console.log('⚙️ Calling Add tokens...');
  await tokenVesting.addTokens(beneficiaries, balances, { gasLimit: 3_000_000 });

  console.log('✅ Tokens Added');
}

module.exports = addBeneficiaries;
