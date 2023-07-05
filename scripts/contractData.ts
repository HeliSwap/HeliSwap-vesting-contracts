// @ts-nocheck
import hardhat from "hardhat";

async function contractData(claimdropAddress: string) {
  console.log(`Getting contract data...`);
  const claimdrop = await hardhat.hethers.getContractAt(
    "ClaimDrop",
    claimdropAddress
  );

  const promiseArray = [
    claimdrop.start(),
    claimdrop.end(),
    claimdrop.cliffEnd(),
    claimdrop.claimExtraTime(),
    claimdrop.totalAllocated(),
  ];

  const [start, end, cliffEnd, claimExtraTime, totalAllocated] =
    await Promise.all(promiseArray);

  console.log("start", start.toString());
  console.log("end", end.toString());
  console.log("cliffEnd", cliffEnd.toString());
  console.log("claimExtraTime", claimExtraTime.toString());
  console.log("totalAllocated", totalAllocated.toString());
}

module.exports = contractData;
