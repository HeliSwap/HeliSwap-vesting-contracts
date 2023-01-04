import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import '@nomiclabs/hardhat-etherscan';
import * as dotenv from "dotenv";

dotenv.config();


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
      ],
    },
    testnet: {
      url: 'https://testnet.hashio.io/api',
      accounts: [process.env.ED25519_PRIV_KEY] // TODO add PKs for `alias ECDSA` accounts here. You can get one at portal.hedera.com
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.MUMBAI_ALCHEMY_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
    },
    hardhat: {
      gas: 15000000,
      blockGasLimit: 15000000,
      allowUnlimitedContractSize: true,
      timeout: 1800000,
      accounts: {
        count: 100,
      }
    },
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY
    }
   },
  defaultNetwork: 'hardhat'
};

export default config;
