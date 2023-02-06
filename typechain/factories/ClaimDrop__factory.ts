/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Signer,
  utils,
  BigNumberish,
  Contract,
  ContractFactory,
  Overrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { ClaimDrop, ClaimDropInterface } from "../ClaimDrop";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "notVestedPercentage",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "defaultLockTime",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ClaimDrop__CanNotAddMoreBeneficiaries",
    type: "error",
  },
  {
    inputs: [],
    name: "ClaimDrop__CanNotReStart",
    type: "error",
  },
  {
    inputs: [],
    name: "ClaimDrop__DivestForbidden",
    type: "error",
  },
  {
    inputs: [],
    name: "ClaimDrop__InvalidCliffDuration",
    type: "error",
  },
  {
    inputs: [],
    name: "ClaimDrop__InvalidVestingDuration",
    type: "error",
  },
  {
    inputs: [],
    name: "ClaimDrop__OnlyBeneficiary",
    type: "error",
  },
  {
    inputs: [],
    name: "ClaimDrop__PercentageOutOfRange",
    type: "error",
  },
  {
    inputs: [],
    name: "ClaimDrop__TooMuchBeneficiariesOrBalances",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "Timelock__AlreadySheduledTo",
    type: "error",
  },
  {
    inputs: [],
    name: "Timelock__ScheduleHasNotBeenSet",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "Timelock__ScheduleNotExpiredYet",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address[]",
        name: "beneficiaries",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "balances",
        type: "uint256[]",
      },
    ],
    name: "BeneficiariesAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Divest",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "vestingDuration",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "end",
        type: "uint256",
      },
    ],
    name: "DurationUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "safeAmount",
        type: "uint256",
      },
    ],
    name: "FailSafeOccurred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalAllocated",
        type: "uint256",
      },
    ],
    name: "Funded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes4",
        name: "fn",
        type: "bytes4",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "schedule",
        type: "uint256",
      },
    ],
    name: "LockSheduled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "claimer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountClaimed",
        type: "uint256",
      },
    ],
    name: "TokensClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "start",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "end",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "cliffEnd",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "claimExtraDuration",
        type: "uint256",
      },
    ],
    name: "VestingStarted",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "beneficiaries",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "balances",
        type: "uint256[]",
      },
    ],
    name: "addBeneficiaries",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimExtraTime",
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
        name: "beneficiary",
        type: "address",
      },
    ],
    name: "claimable",
    outputs: [
      {
        internalType: "uint256",
        name: "availableAllocated",
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
        name: "",
        type: "address",
      },
    ],
    name: "claimedOf",
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
    name: "cliffEnd",
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
    name: "divest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "end",
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
        name: "beneficiary",
        type: "address",
      },
    ],
    name: "extraTokensOf",
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
    name: "failMode",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "failSafe",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "fund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "index",
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
    name: "lockTime",
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
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    name: "locks",
    outputs: [
      {
        internalType: "uint256",
        name: "schedule",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "params",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "fn",
        type: "bytes4",
      },
      {
        internalType: "bytes",
        name: "params",
        type: "bytes",
      },
    ],
    name: "schedule",
    outputs: [],
    stateMutability: "nonpayable",
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
        internalType: "uint256",
        name: "vestingDuration",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "cliffDuration",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "claimExtraDuration",
        type: "uint256",
      },
    ],
    name: "startVesting",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokensNotVestedPercentage",
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
    name: "totalAllocated",
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
        name: "beneficiary",
        type: "address",
      },
    ],
    name: "totalAllocatedOf",
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
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "updateDuration",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "vestedTokensOf",
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
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162001e9f38038062001e9f83398101604081905262000034916200027f565b806200004033620000b4565b6001908155600355670de0b6b3a764000082111562000072576040516336f710c960e11b815260040160405180910390fd5b6200007d8362000104565b50670de0b6b3a7640000600a55600980546001600160a01b0319166001600160a01b03939093169290921790915560085562000321565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6040513060248201526001600160a01b038216604482015260009081906101679060640160408051601f198184030181529181526020820180516001600160e01b031663248a35ef60e11b179052516200015f9190620002c4565b6000604051808303816000865af19150503d80600081146200019e576040519150601f19603f3d011682016040523d82523d6000602084013e620001a3565b606091505b509150915081620001fb5760405162461bcd60e51b815260206004820152601e60248201527f48545320507265636f6d70696c653a2043414c4c5f455843455054494f4e000060448201526064015b60405180910390fd5b600081806020019051810190620002139190620002f5565b90508060030b601614806200022b57508060030b60a7145b620002795760405162461bcd60e51b815260206004820152601a60248201527f48545320507265636f6d70696c653a2043414c4c5f4552524f520000000000006044820152606401620001f2565b50505050565b6000806000606084860312156200029557600080fd5b83516001600160a01b0381168114620002ad57600080fd5b602085015160409095015190969495509392505050565b6000825160005b81811015620002e75760208186018101518583015201620002cb565b506000920191825250919050565b6000602082840312156200030857600080fd5b81518060030b81146200031a57600080fd5b9392505050565b611b6e80620003316000396000f3fe608060405234801561001057600080fd5b50600436106101a95760003560e01c80638da5cb5b116100f9578063ca1d209d11610097578063f4d4cf6a11610071578063f4d4cf6a14610346578063f50096041461034f578063fc0c546a14610362578063fc609d631461037557600080fd5b8063ca1d209d14610317578063efbe1c1c1461032a578063f2fde38b1461033357600080fd5b8063a9610655116100d3578063a9610655146102ba578063b59432fa146102cd578063baa3f7ee146102ee578063be9a65551461030e57600080fd5b80638da5cb5b146102685780639130297b1461028d57806392691ba81461029657600080fd5b80633d0290911161016657806347f1942f1161014057806347f1942f146102255780634e71d92d14610238578063715018a61461024057806384ae42091461024857600080fd5b80633d029091146101f6578063402914f51461020957806345f7f2491461021c57600080fd5b8063058aace1146101ae5780630bc6c96e146101b85780630d668087146101c05780630e953d32146101dc57806321b54da9146101e55780632986c0e5146101ed575b600080fd5b6101b6610388565b005b6101b66104a8565b6101c960015481565b6040519081526020015b60405180910390f35b6101c960085481565b6101b661064d565b6101c9600a5481565b6101b6610204366004611519565b610837565b6101c9610217366004611561565b61091f565b6101c9600b5481565b6101c9610233366004611561565b610b5e565b6101b6610b97565b6101b6610ca7565b6101c9610256366004611561565b600d6020526000908152604090205481565b6000546001600160a01b03165b6040516001600160a01b0390911681526020016101d3565b6101c960065481565b6009546102aa90600160a01b900460ff1681565b60405190151581526020016101d3565b6101b66102c8366004611652565b610cdd565b6102e06102db36600461172a565b610e4e565b6040516101d3929190611769565b6101c96102fc366004611561565b600c6020526000908152604090205481565b6101c960045481565b6101b66103253660046117a3565b610ef3565b6101c960055481565b6101b6610341366004611561565b611020565b6101c960075481565b6101c961035d366004611561565b6110bb565b600954610275906001600160a01b031681565b6101b66103833660046117bc565b6110fd565b6000546001600160a01b031633146103bb5760405162461bcd60e51b81526004016103b29061183f565b60405180910390fd5b426007546005546103cc919061188a565b11156103eb57604051637ea7b04d60e11b815260040160405180910390fd5b6009546040516370a0823160e01b81523060048201526000916001600160a01b0316906370a0823190602401602060405180830381865afa158015610434573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610458919061189d565b600954909150610472906001600160a01b0316338361125c565b6040518181527fb0a94ef79238f7e1bab65ee8d06500f1e5d05572dc1f0d9261ea4dc142c3677f9060200160405180910390a150565b6305e364b760e11b600081815260026020527f797b3a7de887766a2832da74df79ef3ce0baf5a57e0cf55f32899598d83e756c5490036104fb5760405163e232e1f960e01b815260040160405180910390fd5b6001600160e01b031981166000908152600260205260409020544211610553576001600160e01b03198116600090815260026020526040908190205490516349a9b8f760e01b815260048101919091526024016103b2565b60098054600160a01b60ff60a01b198216179091556040516370a0823160e01b81523060048201526000916001600160a01b0316906370a0823190602401602060405180830381865afa1580156105ae573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105d2919061189d565b6009549091506105fd906001600160a01b03166105f76000546001600160a01b031690565b8361125c565b6040518181527fc66bdd0a013af1eb7a4e9720974fbe21b45d455175f375f4517131371f352ed4906020015b60405180910390a1506001600160e01b031916600090815260026020526040812055565b6321b54da960e01b600081815260026020527f6a9449ad569545faadf4b32ffb87a604b54c088e98fafb55e7d1e90f139224e05490036106a05760405163e232e1f960e01b815260040160405180910390fd5b6001600160e01b0319811660009081526002602052604090205442116106f8576001600160e01b03198116600090815260026020526040908190205490516349a9b8f760e01b815260048101919091526024016103b2565b6321b54da960e01b600090815260026020527f6a9449ad569545faadf4b32ffb87a604b54c088e98fafb55e7d1e90f139224e18054610736906118b6565b80601f0160208091040260200160405190810160405280929190818152602001828054610762906118b6565b80156107af5780601f10610784576101008083540402835291602001916107af565b820191906000526020600020905b81548152906001019060200180831161079257829003601f168201915b50505050508060200190518101906107c7919061189d565b9050806004546107d7919061188a565b6005819055600654106107fd576040516303d8882760e21b815260040160405180910390fd5b6005546040805183815260208101929092527ff899c6d536e6cda78c5f4dce43ca0e8c47167deb2875ea8b777f21cc85899b1f9101610629565b6000546001600160a01b031633146108615760405162461bcd60e51b81526004016103b29061183f565b600454156108825760405163b676bcc760e01b815260040160405180910390fd5b8282106108a25760405163acecf3bd60e01b815260040160405180910390fd5b4260048190556108b390849061188a565b6005556108c0824261188a565b60068190556007829055600454600554604080519283526020830191909152810191909152606081018290527f40cfd7cbbf8aae4d4aff9ed9011410e75ba8042410661b56c450666d482181e7906080015b60405180910390a1505050565b6001600160a01b0381166000908152600d60205260408120541580610952575060075460055461094f919061188a565b42115b8061095f57506006544211155b806109735750600954600160a01b900460ff165b1561098057506000919050565b600061098b836110bb565b6008546001600160a01b0385166000908152600d602052604081205492935091670de0b6b3a7640000916109be916118f0565b6109c89190611907565b905060006109d68284611929565b905060006006546005546109ea9190611929565b6006546109f79042611929565b610a0990670de0b6b3a76400006118f0565b610a139190611907565b9050670de0b6b3a7640000811115610a305750670de0b6b3a76400005b336000908152600c602052604090205483670de0b6b3a7640000610a5484866118f0565b610a5e9190611907565b610a68919061188a565b610a729190611929565b6009546040516370a0823160e01b81523060048201529196506001600160a01b0316906370a0823190602401602060405180830381865afa158015610abb573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610adf919061189d565b851115610b55576009546040516370a0823160e01b81523060048201526001600160a01b03909116906370a0823190602401602060405180830381865afa158015610b2e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b52919061189d565b94505b50505050919050565b600080610b6a836110bb565b6001600160a01b0384166000908152600d6020526040902054909150610b909082611929565b9392505050565b336000908152600d60205260408120549003610bc65760405163be118e3d60e01b815260040160405180910390fd5b600260035403610c185760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c0060448201526064016103b2565b60026003556000610c283361091f565b600954909150610c42906001600160a01b0316338361125c565b336000908152600c602052604081208054839290610c6190849061188a565b909155505060408051338152602081018390527f896e034966eaaf1adc54acc0f257056febbd300c9e47182cf761982cf1f5e430910160405180910390a1506001600355565b6000546001600160a01b03163314610cd15760405162461bcd60e51b81526004016103b29061183f565b610cdb600061138d565b565b6000546001600160a01b03163314610d075760405162461bcd60e51b81526004016103b29061183f565b60045415610d2857604051630311105f60e41b815260040160405180910390fd5b8051825114610d4a57604051630e8c876f60e41b815260040160405180910390fd5b6000805b8351811015610dec57828181518110610d6957610d6961193c565b6020026020010151600d6000868481518110610d8757610d8761193c565b60200260200101516001600160a01b03166001600160a01b0316815260200190815260200160002081905550828181518110610dc557610dc561193c565b602002602001015182610dd8919061188a565b915080610de481611952565b915050610d4e565b50600954610e05906001600160a01b03163330846113dd565b80600b6000828254610e17919061188a565b90915550506040517f1b8f63e871995626ba4633e9d24b84bf16a404afce5aaba3b4b48ff7dc0d9ed390610912908590859061196b565b60026020526000908152604090208054600182018054919291610e70906118b6565b80601f0160208091040260200160405190810160405280929190818152602001828054610e9c906118b6565b8015610ee95780601f10610ebe57610100808354040283529160200191610ee9565b820191906000526020600020905b815481529060010190602001808311610ecc57829003601f168201915b5050505050905082565b600260035403610f455760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c0060448201526064016103b2565b6002600355600954610f62906001600160a01b03163330846113dd565b600081600b54610f72919061188a565b600b54909150670de0b6b3a764000090610f8c8184611929565b610f9e90670de0b6b3a76400006118f0565b610fa89190611907565b600a54610fb591906118f0565b610fbf9190611907565b600a54610fcc919061188a565b600a819055600b82905560408051848152602081019290925281018290527f77360216dafe21aa8d455333608207082f74e837ba9b3ef15d0a73cd226937389060600160405180910390a150506001600355565b6000546001600160a01b0316331461104a5760405162461bcd60e51b81526004016103b29061183f565b6001600160a01b0381166110af5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016103b2565b6110b88161138d565b50565b600a546001600160a01b0382166000908152600d60205260408120549091670de0b6b3a7640000916110ed91906118f0565b6110f79190611907565b92915050565b6000546001600160a01b031633146111275760405162461bcd60e51b81526004016103b29061183f565b6001600160e01b03198316600090815260026020526040902054421161117f576001600160e01b03198316600090815260026020526040908190205490516306f0005b60e41b815260048101919091526024016103b2565b604051806040016040528060015442611198919061188a565b815260200183838080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201829052509390945250506001600160e01b031986168152600260209081526040909120835181559083015190915060018201906112089082611a3a565b509050507f369c03d42edb1a921b8b310009b29200b4baab8aece683a6d3a7e7bca855fe11836001544261123c919061188a565b604080516001600160e01b03199093168352602083019190915201610912565b604080516001600160a01b038481166024830152604480830185905283518084039091018152606490920183526020820180516001600160e01b031663a9059cbb60e01b17905291516000928392908716916112b89190611afa565b6000604051808303816000865af19150503d80600081146112f5576040519150601f19603f3d011682016040523d82523d6000602084013e6112fa565b606091505b50915091508180156113245750805115806113245750808060200190518101906113249190611b16565b6113865760405162461bcd60e51b815260206004820152602d60248201527f5472616e7366657248656c7065723a3a736166655472616e736665723a20747260448201526c185b9cd9995c8819985a5b1959609a1b60648201526084016103b2565b5050505050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6040516001600160a01b038481166024830152838116604483015260648201839052600091829187169060840160408051601f198184030181529181526020820180516001600160e01b03166323b872dd60e01b1790525161143f9190611afa565b6000604051808303816000865af19150503d806000811461147c576040519150601f19603f3d011682016040523d82523d6000602084013e611481565b606091505b50915091508180156114ab5750805115806114ab5750808060200190518101906114ab9190611b16565b6115115760405162461bcd60e51b815260206004820152603160248201527f5472616e7366657248656c7065723a3a7472616e7366657246726f6d3a207472604482015270185b9cd9995c919c9bdb4819985a5b1959607a1b60648201526084016103b2565b505050505050565b60008060006060848603121561152e57600080fd5b505081359360208301359350604090920135919050565b80356001600160a01b038116811461155c57600080fd5b919050565b60006020828403121561157357600080fd5b610b9082611545565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff811182821017156115bb576115bb61157c565b604052919050565b600067ffffffffffffffff8211156115dd576115dd61157c565b5060051b60200190565b600082601f8301126115f857600080fd5b8135602061160d611608836115c3565b611592565b82815260059290921b8401810191818101908684111561162c57600080fd5b8286015b848110156116475780358352918301918301611630565b509695505050505050565b6000806040838503121561166557600080fd5b823567ffffffffffffffff8082111561167d57600080fd5b818501915085601f83011261169157600080fd5b813560206116a1611608836115c3565b82815260059290921b840181019181810190898411156116c057600080fd5b948201945b838610156116e5576116d686611545565b825294820194908201906116c5565b965050860135925050808211156116fb57600080fd5b50611708858286016115e7565b9150509250929050565b80356001600160e01b03198116811461155c57600080fd5b60006020828403121561173c57600080fd5b610b9082611712565b60005b83811015611760578181015183820152602001611748565b50506000910152565b828152604060208201526000825180604084015261178e816060850160208701611745565b601f01601f1916919091016060019392505050565b6000602082840312156117b557600080fd5b5035919050565b6000806000604084860312156117d157600080fd5b6117da84611712565b9250602084013567ffffffffffffffff808211156117f757600080fd5b818601915086601f83011261180b57600080fd5b81358181111561181a57600080fd5b87602082850101111561182c57600080fd5b6020830194508093505050509250925092565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b634e487b7160e01b600052601160045260246000fd5b808201808211156110f7576110f7611874565b6000602082840312156118af57600080fd5b5051919050565b600181811c908216806118ca57607f821691505b6020821081036118ea57634e487b7160e01b600052602260045260246000fd5b50919050565b80820281158282048414176110f7576110f7611874565b60008261192457634e487b7160e01b600052601260045260246000fd5b500490565b818103818111156110f7576110f7611874565b634e487b7160e01b600052603260045260246000fd5b60006001820161196457611964611874565b5060010190565b604080825283519082018190526000906020906060840190828701845b828110156119ad5781516001600160a01b031684529284019290840190600101611988565b5050508381038285015284518082528583019183019060005b818110156119e2578351835292840192918401916001016119c6565b5090979650505050505050565b601f821115611a3557600081815260208120601f850160051c81016020861015611a165750805b601f850160051c820191505b8181101561151157828155600101611a22565b505050565b815167ffffffffffffffff811115611a5457611a5461157c565b611a6881611a6284546118b6565b846119ef565b602080601f831160018114611a9d5760008415611a855750858301515b600019600386901b1c1916600185901b178555611511565b600085815260208120601f198616915b82811015611acc57888601518255948401946001909101908401611aad565b5085821015611aea5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60008251611b0c818460208701611745565b9190910192915050565b600060208284031215611b2857600080fd5b81518015158114610b9057600080fdfea264697066735822122066e6c576a7534f86d8ef08ca73b9ad1ff7f52eb9a3da2b0c48f7f2920a7a2d6664736f6c63430008110033";

export class ClaimDrop__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    tokenAddress: string,
    notVestedPercentage: BigNumberish,
    defaultLockTime: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ClaimDrop> {
    return super.deploy(
      tokenAddress,
      notVestedPercentage,
      defaultLockTime,
      overrides || {}
    ) as Promise<ClaimDrop>;
  }
  getDeployTransaction(
    tokenAddress: string,
    notVestedPercentage: BigNumberish,
    defaultLockTime: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      tokenAddress,
      notVestedPercentage,
      defaultLockTime,
      overrides || {}
    );
  }
  attach(address: string): ClaimDrop {
    return super.attach(address) as ClaimDrop;
  }
  connect(signer: Signer): ClaimDrop__factory {
    return super.connect(signer) as ClaimDrop__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ClaimDropInterface {
    return new utils.Interface(_abi) as ClaimDropInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ClaimDrop {
    return new Contract(address, _abi, signerOrProvider) as ClaimDrop;
  }
}
