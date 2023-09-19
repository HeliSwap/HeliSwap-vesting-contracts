// @ts-nocheck
import hardhat from "hardhat";

async function divest(claimdropAddress: string) {
  const claimdrop = await hardhat.hethers.getContractAt(
    "ClaimDrop",
    claimdropAddress
  );

  console.log(`⚙️ Getting unclaimed tokens...`);

  const tx = await claimdrop.divest();
  await tx.wait();

  console.log("✅ Tokens claimed");
}

module.exports = divest;
