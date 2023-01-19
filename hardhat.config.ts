import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";
import "solidity-coverage";
import { task } from "hardhat/config";

import * as dotenv from "dotenv";
dotenv.config();

task("deployMockERC20", "Deploys an ERC20 Mock Contract").setAction(
  async () => {
    const factoryDeployment = require("./scripts/00-deploy-mockerc20");
    await factoryDeployment();
  }
);

task("deployTimelock", "Deploys an ERC20 Mock Contract").setAction(async () => {
  const deployTimelock = require("./scripts/01-deploy-timelock");
  await deployTimelock();
});

task("deployTokenVesting", "Deploys an ERC20 Mock Contract").setAction(
  async () => {
    const deployTokenVesting = require("./scripts/02-deploy-token-vesting");
    await deployTokenVesting();
  }
);

task("addBeneficiaries", "Deploys an ERC20 Mock Contract").setAction(
  async () => {
    const addBeneficiaries = require("./scripts/03-call-add-tokens");
    await addBeneficiaries();
  }
);

module.exports = {
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 9999,
      },
    },
  },
  hedera: {
    gasLimit: 15_000_000,
    networks: {
      localHederaNetwork: {
        consensusNodes: [
          {
            url: "127.0.0.1:50211",
            nodeId: "0.0.3",
          },
        ],
        mirrorNodeUrl: "http://127.0.0.1:5551",
        chainId: 0,
        accounts: [
          {
            account: "0.0.1001",
            privateKey:
              "0x7f109a9e3b0d8ecfba9cc23a3614433ce0fa7ddcc80f2a8f10b222179a5a80d6",
          },
          {
            account: "0.0.1002",
            privateKey:
              "0x6ec1f2e7d126a74a1d2ff9e1c5d90b92378c725e506651ff8bb8616a5c724628",
          },
          {
            account: "0.0.1003",
            privateKey:
              "0xb4d7f7e82f61d81c95985771b8abf518f9328d019c36849d4214b5f995d13814",
          },
          {
            account: "0.0.1004",
            privateKey:
              "0x941536648ac10d5734973e94df413c17809d6cc5e24cd11e947e685acfbd12ae",
          },
          {
            account: "0.0.1005",
            privateKey:
              "0x5829cf333ef66b6bdd34950f096cb24e06ef041c5f63e577b4f3362309125863",
          },
        ],
      },
    },
    defaultNetwork: "localHederaNetwork",
  },
};
