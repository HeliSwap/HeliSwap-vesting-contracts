/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  PayableOverrides,
  BigNumberish,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  VestingWallet,
  VestingWalletInterface,
} from "../../contracts/VestingWallet";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "beneficiaryAddress",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "startTimestamp",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "durationSeconds",
        type: "uint64",
      },
      {
        internalType: "uint256",
        name: "cliffPeriod",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "freeTokensAmount",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "ERC20Released",
    type: "event",
  },
  {
    inputs: [],
    name: "beneficiary",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "cliff",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "duration",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "freeTokens",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "releasable",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "release",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "released",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "start",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "timestamp",
        type: "uint64",
      },
    ],
    name: "vestedAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x60c0604052604051620012c8380380620012c8833981810160405281019062000029919062000230565b600073ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff16036200009b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040162000092906200033f565b60405180910390fd5b8473ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff16815250508367ffffffffffffffff1660a08167ffffffffffffffff168152505082600160006101000a81548167ffffffffffffffff021916908367ffffffffffffffff1602179055508160a05167ffffffffffffffff166200012e919062000390565b600281905550806003819055505050505050620003cb565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600062000178826200014b565b9050919050565b6200018a816200016b565b81146200019657600080fd5b50565b600081519050620001aa816200017f565b92915050565b600067ffffffffffffffff82169050919050565b620001cf81620001b0565b8114620001db57600080fd5b50565b600081519050620001ef81620001c4565b92915050565b6000819050919050565b6200020a81620001f5565b81146200021657600080fd5b50565b6000815190506200022a81620001ff565b92915050565b600080600080600060a086880312156200024f576200024e62000146565b5b60006200025f8882890162000199565b95505060206200027288828901620001de565b94505060406200028588828901620001de565b9350506060620002988882890162000219565b9250506080620002ab8882890162000219565b9150509295509295909350565b600082825260208201905092915050565b7f56657374696e6757616c6c65743a2062656e6566696369617279206973207a6560008201527f726f206164647265737300000000000000000000000000000000000000000000602082015250565b600062000327602a83620002b8565b91506200033482620002c9565b604082019050919050565b600060208201905081810360008301526200035a8162000318565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006200039d82620001f5565b9150620003aa83620001f5565b9250828201905080821115620003c557620003c462000361565b5b92915050565b60805160a051610ed7620003f16000396000610496015260006103490152610ed76000f3fe60806040526004361061008a5760003560e01c80636fe8f9c5116100595780636fe8f9c514610140578063810ec23b1461016b5780639852595c146101a8578063a3f8eace146101e5578063be9a65551461022257610091565b80630fb5a6b41461009657806313d033c0146100c157806319165587146100ec57806338af3eed1461011557610091565b3661009157005b600080fd5b3480156100a257600080fd5b506100ab61024d565b6040516100b8919061088c565b60405180910390f35b3480156100cd57600080fd5b506100d6610275565b6040516100e3919061088c565b60405180910390f35b3480156100f857600080fd5b50610113600480360381019061010e919061090a565b61027f565b005b34801561012157600080fd5b5061012a610345565b6040516101379190610946565b60405180910390f35b34801561014c57600080fd5b5061015561036d565b604051610162919061088c565b60405180910390f35b34801561017757600080fd5b50610192600480360381019061018d91906109a1565b610377565b60405161019f919061088c565b60405180910390f35b3480156101b457600080fd5b506101cf60048036038101906101ca919061090a565b610424565b6040516101dc919061088c565b60405180910390f35b3480156101f157600080fd5b5061020c6004803603810190610207919061090a565b61046c565b604051610219919061088c565b60405180910390f35b34801561022e57600080fd5b50610237610492565b604051610244919061088c565b60405180910390f35b6000600160009054906101000a900467ffffffffffffffff1667ffffffffffffffff16905090565b6000600254905090565b600061028a8261046c565b9050806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546102da9190610a10565b925050819055508173ffffffffffffffffffffffffffffffffffffffff167fc0e523490dd523c33b1878c9eb14ff46991e3f5b2cd33710918618f2a39cba1b82604051610327919061088c565b60405180910390a26103418261033b610345565b836104c4565b5050565b60007f0000000000000000000000000000000000000000000000000000000000000000905090565b6000600354905090565b600061041c61038584610424565b6003548573ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b81526004016103c19190610946565b602060405180830381865afa1580156103de573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104029190610a70565b61040c9190610a9d565b6104169190610a10565b8361054a565b905092915050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b600061047782610424565b6104818342610377565b61048b9190610a9d565b9050919050565b60007f000000000000000000000000000000000000000000000000000000000000000067ffffffffffffffff16905090565b6105458363a9059cbb60e01b84846040516024016104e3929190610ad1565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050506105df565b505050565b60006002548267ffffffffffffffff16101561056957600090506105d9565b61057161024d565b610579610492565b6105839190610a10565b8267ffffffffffffffff16111561059c578290506105d9565b6105a461024d565b6105ac610492565b8367ffffffffffffffff166105c19190610a9d565b846105cc9190610afa565b6105d69190610b6b565b90505b92915050565b6000610641826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c65648152508573ffffffffffffffffffffffffffffffffffffffff166106a69092919063ffffffff16565b90506000815111156106a157808060200190518101906106619190610bd4565b6106a0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161069790610c84565b60405180910390fd5b5b505050565b60606106b584846000856106be565b90509392505050565b606082471015610703576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106fa90610d16565b60405180910390fd5b6000808673ffffffffffffffffffffffffffffffffffffffff16858760405161072c9190610da7565b60006040518083038185875af1925050503d8060008114610769576040519150601f19603f3d011682016040523d82523d6000602084013e61076e565b606091505b509150915061077f8783838761078b565b92505050949350505050565b606083156107ed5760008351036107e5576107a585610800565b6107e4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107db90610e0a565b60405180910390fd5b5b8290506107f8565b6107f78383610823565b5b949350505050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b6000825111156108365781518083602001fd5b806040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161086a9190610e7f565b60405180910390fd5b6000819050919050565b61088681610873565b82525050565b60006020820190506108a1600083018461087d565b92915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006108d7826108ac565b9050919050565b6108e7816108cc565b81146108f257600080fd5b50565b600081359050610904816108de565b92915050565b6000602082840312156109205761091f6108a7565b5b600061092e848285016108f5565b91505092915050565b610940816108cc565b82525050565b600060208201905061095b6000830184610937565b92915050565b600067ffffffffffffffff82169050919050565b61097e81610961565b811461098957600080fd5b50565b60008135905061099b81610975565b92915050565b600080604083850312156109b8576109b76108a7565b5b60006109c6858286016108f5565b92505060206109d78582860161098c565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610a1b82610873565b9150610a2683610873565b9250828201905080821115610a3e57610a3d6109e1565b5b92915050565b610a4d81610873565b8114610a5857600080fd5b50565b600081519050610a6a81610a44565b92915050565b600060208284031215610a8657610a856108a7565b5b6000610a9484828501610a5b565b91505092915050565b6000610aa882610873565b9150610ab383610873565b9250828203905081811115610acb57610aca6109e1565b5b92915050565b6000604082019050610ae66000830185610937565b610af3602083018461087d565b9392505050565b6000610b0582610873565b9150610b1083610873565b9250828202610b1e81610873565b91508282048414831517610b3557610b346109e1565b5b5092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b6000610b7682610873565b9150610b8183610873565b925082610b9157610b90610b3c565b5b828204905092915050565b60008115159050919050565b610bb181610b9c565b8114610bbc57600080fd5b50565b600081519050610bce81610ba8565b92915050565b600060208284031215610bea57610be96108a7565b5b6000610bf884828501610bbf565b91505092915050565b600082825260208201905092915050565b7f5361666545524332303a204552433230206f7065726174696f6e20646964206e60008201527f6f74207375636365656400000000000000000000000000000000000000000000602082015250565b6000610c6e602a83610c01565b9150610c7982610c12565b604082019050919050565b60006020820190508181036000830152610c9d81610c61565b9050919050565b7f416464726573733a20696e73756666696369656e742062616c616e636520666f60008201527f722063616c6c0000000000000000000000000000000000000000000000000000602082015250565b6000610d00602683610c01565b9150610d0b82610ca4565b604082019050919050565b60006020820190508181036000830152610d2f81610cf3565b9050919050565b600081519050919050565b600081905092915050565b60005b83811015610d6a578082015181840152602081019050610d4f565b60008484015250505050565b6000610d8182610d36565b610d8b8185610d41565b9350610d9b818560208601610d4c565b80840191505092915050565b6000610db38284610d76565b915081905092915050565b7f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000600082015250565b6000610df4601d83610c01565b9150610dff82610dbe565b602082019050919050565b60006020820190508181036000830152610e2381610de7565b9050919050565b600081519050919050565b6000601f19601f8301169050919050565b6000610e5182610e2a565b610e5b8185610c01565b9350610e6b818560208601610d4c565b610e7481610e35565b840191505092915050565b60006020820190508181036000830152610e998184610e46565b90509291505056fea2646970667358221220a5cbd559eb79975987e359a066f7221e1613cb9bc90c0baa005d649b1714f60b64736f6c63430008110033";

type VestingWalletConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: VestingWalletConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class VestingWallet__factory extends ContractFactory {
  constructor(...args: VestingWalletConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    beneficiaryAddress: PromiseOrValue<string>,
    startTimestamp: PromiseOrValue<BigNumberish>,
    durationSeconds: PromiseOrValue<BigNumberish>,
    cliffPeriod: PromiseOrValue<BigNumberish>,
    freeTokensAmount: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<VestingWallet> {
    return super.deploy(
      beneficiaryAddress,
      startTimestamp,
      durationSeconds,
      cliffPeriod,
      freeTokensAmount,
      overrides || {}
    ) as Promise<VestingWallet>;
  }
  override getDeployTransaction(
    beneficiaryAddress: PromiseOrValue<string>,
    startTimestamp: PromiseOrValue<BigNumberish>,
    durationSeconds: PromiseOrValue<BigNumberish>,
    cliffPeriod: PromiseOrValue<BigNumberish>,
    freeTokensAmount: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      beneficiaryAddress,
      startTimestamp,
      durationSeconds,
      cliffPeriod,
      freeTokensAmount,
      overrides || {}
    );
  }
  override attach(address: string): VestingWallet {
    return super.attach(address) as VestingWallet;
  }
  override connect(signer: Signer): VestingWallet__factory {
    return super.connect(signer) as VestingWallet__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): VestingWalletInterface {
    return new utils.Interface(_abi) as VestingWalletInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): VestingWallet {
    return new Contract(address, _abi, signerOrProvider) as VestingWallet;
  }
}