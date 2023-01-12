const {
  Wallet,
  LocalProvider,
  ContractCreateTransaction,
  FileCreateTransaction,
  ContractDeleteTransaction,
  ContractCallQuery,
  Hbar,
  ContractFunctionParameters,
  ContractCreateFlow,
} = require("@hashgraph/sdk");
require("dotenv").config();
const Timelock = require("../../artifacts/contracts/Timelock.sol/Timelock.json");

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
  const contractByteCode = Timelock.bytecode;

  const constructorParameters = new ContractFunctionParameters()
  .addInt256(10)
  .addAddressArray(["0x00000000000000000000000000000000000003f9", "0x0000000000000000000000000000000000001f0f"])
  .addAddressArray(["0x0000000000000000000000000000000000002A02", "0x0000000000000000000000000000000000003Dcb"])
  .addAddress("0x0000000000000000000000000000000002E14EEF");

  const contractCreate = new ContractCreateFlow()
    .setGas(1000000)
    .setBytecode(contractByteCode)
    .setConstructorParameters(constructorParameters);

  let fileTransactionResponse = await contractCreate.executeWithSigner(wallet);

  // Fetch the receipt for transaction that created the file
  const fileReceipt = await fileTransactionResponse.getReceiptWithSigner(
    wallet
  );

  const newContractId = (await fileReceipt).contractId;

  console.log(newContractId); // https://hashscan.io/testnet/contract/0.0.49268684


  // The file ID is located on the transaction receipt
//   const fileId = fileReceipt.fileId;

//   console.log(`contract bytecode file: ${fileId.toString()}`);

//   // Create the contract
//   transaction = await new ContractCreateTransaction()
//     // Set gas to create the contract
//     .setGas(100000)
//     // The contract bytecode must be set to the file ID containing the contract bytecode
//     .setBytecodeFileId(fileId)
//     // Set the admin key on the contract in case the contract should be deleted or
//     // updated in the future
//     .setAdminKey(wallet.getAccountKey())
//     .setConstructorParameters(constructorParameters)
//     .freezeWithSigner(wallet);
//   transaction = await transaction.signWithSigner(wallet);

//   const contractTransactionResponse = await transaction.executeWithSigner(
//     wallet
//   );

//   // Fetch the receipt for the transaction that created the contract
//   const contractReceipt =
//     await contractTransactionResponse.getReceiptWithSigner(wallet);

//   // The conract ID is located on the transaction receipt
//   const contractId = contractReceipt.contractId;

//   console.log(`New Timelock contract ID: ${contractId.toString()}`);

//   const message = contractCallResult.getString(0);
//   console.log(`contract message: ${message}`);
}

void main();
