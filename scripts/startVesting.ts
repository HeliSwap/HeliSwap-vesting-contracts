// @ts-nocheck
import hardhat from "hardhat";

async function startVesting(
  claimdropAddress: string,
  vestingDuration: number,
  cliffDuration: number,
  claimExtraDuration: number
) {
  console.log(`Starting vesting...`);
  const claimdrop = await hardhat.hethers.getContractAt(
    "ClaimDrop",
    claimdropAddress
  );

  await claimdrop.startVesting(
    vestingDuration,
    cliffDuration,
    claimExtraDuration,
    {
      gasLimit: 3_000_000,
    }
  );
  console.log(`✅ Vesting started!`);
}

module.exports = startVesting;
