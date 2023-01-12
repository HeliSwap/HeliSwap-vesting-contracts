const {
    Wallet,
    LocalProvider,
    ContractCreateFlow,
  } = require("@hashgraph/sdk");
  require("dotenv").config();
  const MockERC20 = require("../../artifacts/contracts/MockERC20.sol/MockERC20.json");
  
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
    const contractByteCode = MockERC20.bytecode;
  
    const contractCreate = new ContractCreateFlow()
      .setGas(1000000)
      .setBytecode(contractByteCode);
  
    let fileTransactionResponse = await contractCreate.executeWithSigner(wallet);
  
    // Fetch the receipt for transaction that created the file
    const fileReceipt = await fileTransactionResponse.getReceiptWithSigner(
      wallet
    );
  
    const newContractId = (await fileReceipt).contractId;
  
    console.log("MockERC20 Address: ", newContractId); // https://hashscan.io/testnet/contract/0.0.49268878
  }
  
  void main();
  