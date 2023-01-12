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
    ContractCallQuery,
    Hbar
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

    // let beneficiaries = [];
    // let balances = [];
  
    // for(let i = 0; i < 50; i++) {
    //   const address = addressesArray[i].address;
    //   beneficiaries.push(address);
    //   balances.push(1);
    // }
  
    // console.log("Beneficiares len: ", beneficiaries.length);
    // console.log("Balances len: ", balances.length);

    const functionParameters = new ContractFunctionParameters()
    .addAddress("0x0000000000000000000000000000000002E14EEF");
  
    // const contractCallResult = await new ContractExecuteTransaction()
    //   // Set the gas to execute a contract call
    //   .setGas(1000000)
    //   // Set which contract
    //   .setContractId(contractId)
    //   // Set the function to call on the contract
    //   .setFunction("balanceOf", functionParameters)
    //   .setNodeAccountIds(nodeId)
    //   .freezeWith(client);

      const query = new ContractCallQuery()
      .setContractId(contractId)
      .setGas(1000000)
      .setMaxQueryPayment(new Hbar(2))
      .setFunction("owner");
  
    // const transactionBytes = contractCallResult.toBytes();
    // const transactionToExecute = Transaction.fromBytes(transactionBytes);
  
    const result = await query.execute(client);
    //const receipt = await result.getReceipt(client);
    console.log(result.getAddress());
    //console.log(receipt);
  }
  
  void main();
  