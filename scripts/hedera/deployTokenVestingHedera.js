const {
  Wallet,
  LocalProvider,
  ContractFunctionParameters,
  ContractCreateFlow,
} = require("@hashgraph/sdk");

require("dotenv").config();
addressesArray = require("./addresses.json");
const TokenVesting = require("../../artifacts/contracts/TokenVesting.sol/TokenVesting.json");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  if (
    process.env.MY_ACCOUNT_ID == null ||
    process.env.HEDERA_PRIVATE_KEY == null
  ) {
    throw new Error(
      "Environment variables MY_ACCOUNT_ID, and HEDERA_PRIVATE_KEY are required."
    );
  }

  const wallet = new Wallet(
    process.env.MY_ACCOUNT_ID,
    process.env.HEDERA_PRIVATE_KEY,
    new LocalProvider()
  );

  // The contract bytecode is located on the `object` field
  const contractByteCode = TokenVesting.bytecode;

  const timelockAddress = "0x0000000000000000000000000000000002EFc7cC";
  const mockERC20Address = "0x0000000000000000000000000000000002efc88e";

  // const beneficiaries = [
  //   "0x00000000000000000000000000000000000003f9",
  //   "0x0000000000000000000000000000000000001f0f",
  //   "0x0000000000000000000000000000000000002A02",
  //   "0x0000000000000000000000000000000000003Dcb",
  // ];

  // const balances = [10, 20, 30, 40];

  let beneficiaries = [];
  let balances = [];

  for(let i = 0; i < 1; i++) {
    const address = addressesArray[i].address;
    beneficiaries.push(address);
    balances.push(i+1);
  }

  console.log("Beneficiares len: ", beneficiaries.length);
  console.log("Balances len: ", balances.length);

  const cliffPeriod = 10;
  const freeTokensPercentage = 10;
  const startTimestamp = 1673438722;
  const duration = 3600;

  const constructorParameters = new ContractFunctionParameters()
    .addAddress(mockERC20Address)
    .addAddress(timelockAddress)
    .addAddressArray(beneficiaries)
    .addInt256Array(balances)
    .addInt256(cliffPeriod)
    .addInt256(freeTokensPercentage)
    .addInt256(startTimestamp)
    .addInt256(duration);

  const contractCreate = new ContractCreateFlow()
    .setGas(10000000)
    .setBytecode(contractByteCode)
    .setConstructorParameters(constructorParameters);

  let fileTransactionResponse = await contractCreate.executeWithSigner(wallet);

  // Fetch the receipt for transaction that created the file
  const fileReceipt = await fileTransactionResponse.getReceiptWithSigner(
    wallet
  );

  const newContractId = (await fileReceipt).contractId;

  console.log("TokenVesting Address: ", newContractId); 
  
  // https://hashscan.io/testnet/contract/0.0.49269227 - 4 beneficiaries => 1000000 gas
  // https://hashscan.io/testnet/contract/0.0.49269785 - 50 beneficiaries => 5000000 gas
  // https://hashscan.io/testnet/contract/0.0.49269916 - 50 beneficiaries => 10000000 gas 49270819
  // https://hashscan.io/testnet/contract/0.0.49271500 - without SafeERC20Transfer
}

void main();
