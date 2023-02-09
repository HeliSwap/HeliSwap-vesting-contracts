import * as dotenv from "dotenv";

import { task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "hardhat-tracer";
import "solidity-coverage";
import "hardhat-contract-sizer";

import * as config from "./config";

require("@hashgraph/hardhat-hethers"); // UNCOMMENT WHEN EXECUTING SCRIPTS; COMMENT WHEN RUNNING TESTS

dotenv.config();

task("deploy", "Deploy a ClaimDrop")
  .addParam("tokenAddress", "Heli token address")
  .addParam("vestingPercentage", "Percentage that is not vested, but free")
  .addParam("lockTime", "Timelock")
  .setAction(async (taskArgs) => {
    const { tokenAddress, vestingPercentage, lockTime } = taskArgs;
    const deploy = require("./scripts/deploy");
    await deploy(tokenAddress, vestingPercentage, lockTime);
  });

task("addBeneficiaries", "Add Beneficiaries")
  .addParam("tokenAddress", "Heli token address")
  .addParam("claimdrop", "Claimdrop contract")
  .setAction(async (taskArgs) => {
    const { tokenAddress, claimdrop } = taskArgs;
    const addBeneficiaries = require("./scripts/addBeneficiaries");
    await addBeneficiaries(tokenAddress, claimdrop);
  });

task("startVesting", "Start Vesting")
  .addParam("claimdrop", "Claimdrop contract")
  .addParam("vestingDuration", "Vesting duration")
  .addParam("cliffDuration", "Cliff duration")
  .addParam("claimExtraDuration", "Claim extra duration")
  .setAction(async (taskArgs) => {
    const { claimdrop, vestingDuration, cliffDuration, claimExtraDuration } =
      taskArgs;
    const startVesting = require("./scripts/startVesting");
    await startVesting(
      claimdrop,
      vestingDuration,
      cliffDuration,
      claimExtraDuration
    );
  });

const accounts = [
  {
    privateKey:
      "0xe80902f1423234ab6de5232a497a2dad6825185949438bdf02ef36cd3f38d62c",
    balance: "111371231719819352917048000",
  },
  {
    privateKey:
      "0x8dc23d20e4cc1c1bce80b3610d2b9c3d2dcc917fe838d6161c7b7107ea8049d2",
    balance: "111371231719819352917048000",
  },
  {
    privateKey:
      "0xf467b3f495971ec1804cd753984e2ab03affc8574c35bd302d611f93420c1861",
    balance: "111371231719819352917048000",
  },
  {
    privateKey:
      "0x195c2fce7255bddbea14def3ca04fd5bf2b53e749cd2d4ac33a85d6872e798f6",
    balance: "111371231719819352917048000",
  },
  {
    privateKey:
      "0xa9039111697f2c0c51d0c2f35cb1fc1fa9f0456e1a0b58c297d4940eda35b135",
    balance: "111371231719819352917048000",
  },
  {
    privateKey:
      "0xd32ba1893d2c189fb6ce63ef03c63e2aa7cf2893c60c39851d2c576fd7bb8b65",
    balance: "111371231719819352917048000",
  },
  {
    privateKey:
      "0xf9def8e25a2538e0a090bce36e9cd7815d04347171383f9dcb6362078c4437df",
    balance: "111371231719819352917048000",
  },
  {
    privateKey:
      "0xe57de1dc1573318d0a7e81367138c09b04a6a6bc6f46858c3a09d1f7a25ee72d",
    balance: "111371231719819352917048000",
  },
  {
    privateKey:
      "0x81274be2a9a23d2bcb6786b786917b3641d8dff69b541a7f1d20151a145a4114",
    balance: "111371231719819352917048000",
  },
  {
    privateKey:
      "0xf1ddce51d38205805c1574e46dc3982c5cdad8e78641200280be1df7487bdbac",
    balance: "111371231719819352917048000",
  },
];

module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      // required for smocks plugin
      outputSelection: {
        "*": {
          "*": ["storageLayout"],
        },
      },
    },
  },
  paths: {
    sources: "./contracts",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    localhost: {
      url: "http://localhost:8545",
    },
    hardhat: {
      allowUnlimitedContractSize: true,
      forking: {
        url: "" + process.env.MAINNET_KEY,
        blockNumber: 15680777,
      },
      // mining: {
      //   auto: false,
      //   interval: 13000,
      // },
      accounts,
    },
  },
  hedera: {
    networks: config.networks,
    gasLimit: 2_000_000,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "",
  },
};
