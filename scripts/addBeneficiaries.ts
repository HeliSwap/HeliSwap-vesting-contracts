// @ts-nocheck
import hardhat from "hardhat";

async function addBeneficiaries(
  tokenAddress: string,
  claimdropAddress: string
) {
  console.log(`Adding beneficiaries...`);
  const claimdrop = await hardhat.hethers.getContractAt(
    "ClaimDrop",
    claimdropAddress
  );

  const tokenAmount = 100000000000;

  // Approve tokens
  console.log(`Approving token...`);
  const tokenContract = await hardhat.hethers.getContractAt(
    "IERC20",
    tokenAddress
  );
  await tokenContract.approve(claimdrop.address, tokenAmount);
  console.log(`✅ Token approved!`);

  const beneficiaries = ["0x0000000000000000000000000000000000001b73"];
  const balances = [hardhat.ethers.utils.parseUnits("100", 8)];

  await claimdrop.addBeneficiaries(beneficiaries, balances, {
    gasLimit: 3_000_000,
  });
  console.log(`✅ Beneficiaries added!`);
}

module.exports = addBeneficiaries;
