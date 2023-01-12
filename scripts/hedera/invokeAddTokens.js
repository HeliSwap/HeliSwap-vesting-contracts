const {
    Client,
    PrivateKey,
    PublicKey,
    AccountCreateTransaction,
    AccountBalanceQuery,
    ContractFunctionParameters,
    AccountId,
    ContractExecuteTransaction,
    LocalProvider,
    Wallet,
    Transaction,
    TransactionId,
    Timestamp,
  } = require("@hashgraph/sdk");
  addressesArray = require("./addresses.json");
  require("dotenv").config();
  
  async function main() {
    if (process.env.MY_ACCOUNT_ID == null || process.env.HEDERA_PRIVATE_KEY == null) {
      throw new Error(
        "Environment variables MY_ACCOUNT_ID, and HEDERA_PRIVATE_KEY are required."
      );
    }
  
    const wallet = new Wallet(
      process.env.MY_ACCOUNT_ID,
      process.env.HEDERA_PRIVATE_KEY,
      new LocalProvider()
    );
  
    const client = Client.forTestnet();
  
    client.setOperator(process.env.MY_ACCOUNT_ID, process.env.HEDERA_PRIVATE_KEY);
  
    const nodeId = [];
    nodeId.push(new AccountId(3));
  
    console.log("Acc: ", wallet.getAccountId().toString());
  
    const contractId = "0.0.49271500";

    let beneficiaries = [];
    let balances = [];
  
    for(let i = 0; i < 50; i++) {
      const address = addressesArray[i].address;
      beneficiaries.push(address);
      balances.push(1);
    }
  
    console.log("Beneficiares len: ", beneficiaries.length);
    console.log("Balances len: ", balances.length);

    const functionParameters = new ContractFunctionParameters()
    .addAddressArray(beneficiaries)
    .addInt256Array(balances);
  
    const contractCallResult = await new ContractExecuteTransaction()
      // Set the gas to execute a contract call
      .setGas(1000000)
      // Set which contract
      .setContractId(contractId)
      // Set the function to call on the contract
      .setFunction("addTokens", functionParameters)
      .setNodeAccountIds(nodeId)
      .freezeWith(client);
  
    const transactionBytes = contractCallResult.toBytes();
    const transactionToExecute = Transaction.fromBytes(transactionBytes);
  
    const result = await transactionToExecute.execute(client);
    const receipt = await result.getReceipt(client);
    console.log(receipt.status.toString());
  }
  
  void main();
  