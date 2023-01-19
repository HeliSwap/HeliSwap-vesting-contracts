import { HardhatUserConfig } from "hardhat/config";
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

const config: HardhatUserConfig = {
  gasReporter: {
    enabled: true,
  },
  solidity: "0.8.17",
  networks: {
    dev: {
      url: 'http://localhost:7546',
      accounts: [
        '0x105d050185ccb907fba04dd92d8de9e32c18305e097ab41dadda21489a211524', // DEV PK do not use in Production
        '0x520568f3394877b17831ba1971974b629fa98ddab4c06e8856c5ae8123188bc4',
        '0xb9ea0174648293031e3730c3a9b48aa075fe36343dbd5b3015595aeba36f547f',
        '0x7f109a9e3b0d8ecfba9cc23a3614433ce0fa7ddcc80f2a8f10b222179a5a80d6'
      ],
      gasLimit: 15_000_000,
      chainId: 298
    },
    testnet: {
      url: 'https://testnet.hashio.io/api',
      accounts: ["0xb9ea0174648293031e3730c3a9b48aa075fe36343dbd5b3015595aeba36f547f"],
      timeout: 1800000,
    },
    hardhat: {
      gasLimit: 300000,
      allowUnlimitedContractSize: true,
      timeout: 1800000,
      accounts: {
        count: 1000,
      }
    },
  },
  defaultNetwork: 'dev'
};

export default config;
