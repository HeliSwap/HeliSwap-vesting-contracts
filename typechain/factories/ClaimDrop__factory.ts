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
        name: "availableToClaim",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "availableVested",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "availableExtra",
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
        name: "",
        type: "address",
      },
    ],
    name: "extraClaimedOf",
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
    name: "failSafe",
    outputs: [],
    stateMutability: "nonpayable",
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
  "0x60806040523480156200001157600080fd5b506040516200214038038062002140833981016040819052620000349162000273565b806200004033620000a8565b6001908155600355670de0b6b3a764000082111562000072576040516336f710c960e11b815260040160405180910390fd5b6200007d83620000f8565b50600980546001600160a01b0319166001600160a01b03939093169290921790915560085562000315565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6040513060248201526001600160a01b038216604482015260009081906101679060640160408051601f198184030181529181526020820180516001600160e01b031663248a35ef60e11b17905251620001539190620002b8565b6000604051808303816000865af19150503d806000811462000192576040519150601f19603f3d011682016040523d82523d6000602084013e62000197565b606091505b509150915081620001ef5760405162461bcd60e51b815260206004820152601e60248201527f48545320507265636f6d70696c653a2043414c4c5f455843455054494f4e000060448201526064015b60405180910390fd5b600081806020019051810190620002079190620002e9565b90508060030b601614806200021f57508060030b60a7145b6200026d5760405162461bcd60e51b815260206004820152601a60248201527f48545320507265636f6d70696c653a2043414c4c5f4552524f520000000000006044820152606401620001e6565b50505050565b6000806000606084860312156200028957600080fd5b83516001600160a01b0381168114620002a157600080fd5b602085015160409095015190969495509392505050565b6000825160005b81811015620002db5760208186018101518583015201620002bf565b506000920191825250919050565b600060208284031215620002fc57600080fd5b81518060030b81146200030e57600080fd5b9392505050565b611e1b80620003256000396000f3fe608060405234801561001057600080fd5b50600436106101735760003560e01c806384cdc95c116100de578063be9a655511610097578063f4d4cf6a11610071578063f4d4cf6a1461030b578063f500960414610314578063fc0c546a14610327578063fc609d631461033a57600080fd5b8063be9a6555146102e6578063efbe1c1c146102ef578063f2fde38b146102f857600080fd5b806384cdc95c146102445780638da5cb5b146102645780639130297b14610289578063a961065514610292578063b59432fa146102a5578063baa3f7ee146102c657600080fd5b8063402914f511610130578063402914f5146101ca57806345f7f249146101f857806347f1942f146102015780634e71d92d14610214578063715018a61461021c57806384ae42091461022457600080fd5b8063058aace1146101785780630bc6c96e146101825780630d6680871461018a5780630e953d32146101a657806321b54da9146101af5780633d029091146101b7575b600080fd5b61018061034d565b005b61018061046d565b61019360015481565b6040519081526020015b60405180910390f35b61019360085481565b610180610600565b6101806101c53660046117ab565b61080a565b6101dd6101d83660046117f3565b6108f2565b6040805193845260208401929092529082015260600161019d565b610193600a5481565b61019361020f3660046117f3565b610bd9565b610180610cbc565b610180610fc7565b6101936102323660046117f3565b600d6020526000908152604090205481565b6101936102523660046117f3565b600c6020526000908152604090205481565b6000546001600160a01b03165b6040516001600160a01b03909116815260200161019d565b61019360065481565b6101806102a03660046118eb565b610ffd565b6102b86102b33660046119c3565b61116e565b60405161019d929190611a2e565b6101936102d43660046117f3565b600b6020526000908152604090205481565b61019360045481565b61019360055481565b6101806103063660046117f3565b611213565b61019360075481565b6101936103223660046117f3565b6112ae565b600954610271906001600160a01b031681565b610180610348366004611a47565b6112e0565b6000546001600160a01b031633146103805760405162461bcd60e51b815260040161037790611aca565b60405180910390fd5b426007546005546103919190611b15565b11156103b057604051637ea7b04d60e11b815260040160405180910390fd5b6009546040516370a0823160e01b81523060048201526000916001600160a01b0316906370a0823190602401602060405180830381865afa1580156103f9573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061041d9190611b28565b600954909150610437906001600160a01b0316338361143f565b6040518181527fb0a94ef79238f7e1bab65ee8d06500f1e5d05572dc1f0d9261ea4dc142c3677f9060200160405180910390a150565b6305e364b760e11b600081815260026020527f797b3a7de887766a2832da74df79ef3ce0baf5a57e0cf55f32899598d83e756c5490036104c05760405163e232e1f960e01b815260040160405180910390fd5b6001600160e01b031981166000908152600260205260409020544211610518576001600160e01b03198116600090815260026020526040908190205490516349a9b8f760e01b81526004810191909152602401610377565b6009546040516370a0823160e01b81523060048201526000916001600160a01b0316906370a0823190602401602060405180830381865afa158015610561573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105859190611b28565b6009549091506105b0906001600160a01b03166105aa6000546001600160a01b031690565b8361143f565b6040518181527fc66bdd0a013af1eb7a4e9720974fbe21b45d455175f375f4517131371f352ed4906020015b60405180910390a1506001600160e01b031916600090815260026020526040812055565b6321b54da960e01b600081815260026020527f6a9449ad569545faadf4b32ffb87a604b54c088e98fafb55e7d1e90f139224e05490036106535760405163e232e1f960e01b815260040160405180910390fd5b6001600160e01b0319811660009081526002602052604090205442116106ab576001600160e01b03198116600090815260026020526040908190205490516349a9b8f760e01b81526004810191909152602401610377565b6321b54da960e01b600090815260026020527f6a9449ad569545faadf4b32ffb87a604b54c088e98fafb55e7d1e90f139224e180546106e990611b41565b80601f016020809104026020016040519081016040528092919081815260200182805461071590611b41565b80156107625780601f1061073757610100808354040283529160200191610762565b820191906000526020600020905b81548152906001019060200180831161074557829003601f168201915b505050505080602001905181019061077a9190611b28565b90508060045461078a9190611b15565b600581905561079890611570565b6107a181611570565b6107ac600654611570565b600554600654106107d0576040516303d8882760e21b815260040160405180910390fd5b6005546040805183815260208101929092527ff899c6d536e6cda78c5f4dce43ca0e8c47167deb2875ea8b777f21cc85899b1f91016105dc565b6000546001600160a01b031633146108345760405162461bcd60e51b815260040161037790611aca565b600454156108555760405163b676bcc760e01b815260040160405180910390fd5b8282106108755760405163acecf3bd60e01b815260040160405180910390fd5b426004819055610886908490611b15565b6005556108938242611b15565b60068190556007829055600454600554604080519283526020830191909152810191909152606081018290527f40cfd7cbbf8aae4d4aff9ed9011410e75ba8042410661b56c450666d482181e7906080015b60405180910390a1505050565b60008060008061090185610bd9565b90506109306040518060400160405280600b81526020016a6578747261546f6b656e7360a81b815250826115b5565b6008546001600160a01b0386166000908152600d60205260408120549091670de0b6b3a7640000916109629190611b7b565b61096c9190611b92565b905061099f6040518060400160405280600f81526020016e1d1bdad95b9cd39bdd15995cdd1959608a1b815250826115b5565b6001600160a01b0386166000908152600d60205260408120546109c3908390611bb4565b90506109f36040518060400160405280600c81526020016b1d1bdad95b9cd5995cdd195960a21b815250826115b5565b6000600654600554610a059190611bb4565b600654610a129042611bb4565b610a2490670de0b6b3a7640000611b7b565b610a2e9190611b92565b9050610a5b6040518060400160405280600981526020016874696d65526174696f60b81b815250826115b5565b610a996040518060400160405280600f81526020016e0626c6f636b2e74696d657374616d7608c1b81525060065442610a949190611bb4565b6115b5565b610ac860405180604001604052806003815260200162195b9960ea1b815250600654600554610a949190611bb4565b670de0b6b3a7640000811115610ae35750670de0b6b3a76400005b336000908152600c6020526040902054670de0b6b3a7640000610b068387611b7b565b610b109190611b92565b610b1a9190611bb4565b336000908152600b6020526040902054909550670de0b6b3a7640000610b408385611b7b565b610b4a9190611b92565b610b549190611bb4565b9550610b866040518060400160405280600e81526020016d617661696c61626c65457874726160901b815250866115b5565b610bb76040518060400160405280600f81526020016e185d985a5b18589b1955995cdd1959608a1b815250876115b5565b82610bc28787611b15565b610bcc9190611b15565b9650505050509193909250565b600a546009546040516370a0823160e01b8152306004820152600092839290916001600160a01b03909116906370a0823190602401602060405180830381865afa158015610c2b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c4f9190611b28565b610c599190611bb4565b600a546001600160a01b0385166000908152600d602052604081205492935091610c8b90670de0b6b3a7640000611b7b565b610c959190611b92565b9050670de0b6b3a7640000610caa8383611b7b565b610cb49190611b92565b949350505050565b336000908152600d60205260408120549003610ceb5760405163be118e3d60e01b815260040160405180910390fd5b600260035403610d3d5760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606401610377565b600260035560008080610d4f336108f2565b6009546040516370a0823160e01b8152306004820152939650919450925084916001600160a01b03909116906370a0823190602401602060405180830381865afa158015610da1573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610dc59190611b28565b1015610e3a576009546040516370a0823160e01b81523060048201526001600160a01b03909116906370a0823190602401602060405180830381865afa158015610e13573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e379190611b28565b92505b600954610e51906001600160a01b0316338561143f565b336000908152600b602052604081208054849290610e70908490611b15565b9091555050336000908152600c602052604081208054839290610e94908490611b15565b9091555050600a54821115610ea957600a5491505b81600a6000828254610ebb9190611bb4565b92505081905550610ef46040518060400160405280600e81526020016d1d1bdd185b105b1b1bd8d85d195960921b815250600a546115b5565b604080518082018252600d81526c746f6b656e2062616c616e636560981b602082015260095491516370a0823160e01b8152306004820152610f84926001600160a01b0316906370a0823190602401602060405180830381865afa158015610f60573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a949190611b28565b60408051338152602081018590527f896e034966eaaf1adc54acc0f257056febbd300c9e47182cf761982cf1f5e430910160405180910390a15050600160035550565b6000546001600160a01b03163314610ff15760405162461bcd60e51b815260040161037790611aca565b610ffb60006115fe565b565b6000546001600160a01b031633146110275760405162461bcd60e51b815260040161037790611aca565b6004541561104857604051630311105f60e41b815260040160405180910390fd5b805182511461106a57604051630e8c876f60e41b815260040160405180910390fd5b6000805b835181101561110c5782818151811061108957611089611bc7565b6020026020010151600d60008684815181106110a7576110a7611bc7565b60200260200101516001600160a01b03166001600160a01b03168152602001908152602001600020819055508281815181106110e5576110e5611bc7565b6020026020010151826110f89190611b15565b91508061110481611bdd565b91505061106e565b50600954611125906001600160a01b031633308461164e565b80600a60008282546111379190611b15565b90915550506040517f1b8f63e871995626ba4633e9d24b84bf16a404afce5aaba3b4b48ff7dc0d9ed3906108e59085908590611bf6565b6002602052600090815260409020805460018201805491929161119090611b41565b80601f01602080910402602001604051908101604052809291908181526020018280546111bc90611b41565b80156112095780601f106111de57610100808354040283529160200191611209565b820191906000526020600020905b8154815290600101906020018083116111ec57829003601f168201915b5050505050905082565b6000546001600160a01b0316331461123d5760405162461bcd60e51b815260040161037790611aca565b6001600160a01b0381166112a25760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610377565b6112ab816115fe565b50565b6001600160a01b0381166000908152600d60205260408120546112d083610bd9565b6112da9190611b15565b92915050565b6000546001600160a01b0316331461130a5760405162461bcd60e51b815260040161037790611aca565b6001600160e01b031983166000908152600260205260409020544211611362576001600160e01b03198316600090815260026020526040908190205490516306f0005b60e41b81526004810191909152602401610377565b60405180604001604052806001544261137b9190611b15565b815260200183838080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201829052509390945250506001600160e01b031986168152600260209081526040909120835181559083015190915060018201906113eb9082611cc5565b509050507f369c03d42edb1a921b8b310009b29200b4baab8aece683a6d3a7e7bca855fe11836001544261141f9190611b15565b604080516001600160e01b031990931683526020830191909152016108e5565b604080516001600160a01b038481166024830152604480830185905283518084039091018152606490920183526020820180516001600160e01b031663a9059cbb60e01b179052915160009283929087169161149b9190611d85565b6000604051808303816000865af19150503d80600081146114d8576040519150601f19603f3d011682016040523d82523d6000602084013e6114dd565b606091505b50915091508180156115075750805115806115075750808060200190518101906115079190611da1565b6115695760405162461bcd60e51b815260206004820152602d60248201527f5472616e7366657248656c7065723a3a736166655472616e736665723a20747260448201526c185b9cd9995c8819985a5b1959609a1b6064820152608401610377565b5050505050565b6112ab8160405160240161158691815260200190565b60408051601f198184030181529190526020810180516001600160e01b031663f5b1bba960e01b17905261178a565b6115fa82826040516024016115cb929190611dc3565b60408051601f198184030181529190526020810180516001600160e01b03166309710a9d60e41b17905261178a565b5050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6040516001600160a01b038481166024830152838116604483015260648201839052600091829187169060840160408051601f198184030181529181526020820180516001600160e01b03166323b872dd60e01b179052516116b09190611d85565b6000604051808303816000865af19150503d80600081146116ed576040519150601f19603f3d011682016040523d82523d6000602084013e6116f2565b606091505b509150915081801561171c57508051158061171c57508080602001905181019061171c9190611da1565b6117825760405162461bcd60e51b815260206004820152603160248201527f5472616e7366657248656c7065723a3a7472616e7366657246726f6d3a207472604482015270185b9cd9995c919c9bdb4819985a5b1959607a1b6064820152608401610377565b505050505050565b80516a636f6e736f6c652e6c6f67602083016000808483855afa5050505050565b6000806000606084860312156117c057600080fd5b505081359360208301359350604090920135919050565b80356001600160a01b03811681146117ee57600080fd5b919050565b60006020828403121561180557600080fd5b61180e826117d7565b9392505050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff8111828210171561185457611854611815565b604052919050565b600067ffffffffffffffff82111561187657611876611815565b5060051b60200190565b600082601f83011261189157600080fd5b813560206118a66118a18361185c565b61182b565b82815260059290921b840181019181810190868411156118c557600080fd5b8286015b848110156118e057803583529183019183016118c9565b509695505050505050565b600080604083850312156118fe57600080fd5b823567ffffffffffffffff8082111561191657600080fd5b818501915085601f83011261192a57600080fd5b8135602061193a6118a18361185c565b82815260059290921b8401810191818101908984111561195957600080fd5b948201945b8386101561197e5761196f866117d7565b8252948201949082019061195e565b9650508601359250508082111561199457600080fd5b506119a185828601611880565b9150509250929050565b80356001600160e01b0319811681146117ee57600080fd5b6000602082840312156119d557600080fd5b61180e826119ab565b60005b838110156119f95781810151838201526020016119e1565b50506000910152565b60008151808452611a1a8160208601602086016119de565b601f01601f19169290920160200192915050565b828152604060208201526000610cb46040830184611a02565b600080600060408486031215611a5c57600080fd5b611a65846119ab565b9250602084013567ffffffffffffffff80821115611a8257600080fd5b818601915086601f830112611a9657600080fd5b813581811115611aa557600080fd5b876020828501011115611ab757600080fd5b6020830194508093505050509250925092565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b634e487b7160e01b600052601160045260246000fd5b808201808211156112da576112da611aff565b600060208284031215611b3a57600080fd5b5051919050565b600181811c90821680611b5557607f821691505b602082108103611b7557634e487b7160e01b600052602260045260246000fd5b50919050565b80820281158282048414176112da576112da611aff565b600082611baf57634e487b7160e01b600052601260045260246000fd5b500490565b818103818111156112da576112da611aff565b634e487b7160e01b600052603260045260246000fd5b600060018201611bef57611bef611aff565b5060010190565b604080825283519082018190526000906020906060840190828701845b82811015611c385781516001600160a01b031684529284019290840190600101611c13565b5050508381038285015284518082528583019183019060005b81811015611c6d57835183529284019291840191600101611c51565b5090979650505050505050565b601f821115611cc057600081815260208120601f850160051c81016020861015611ca15750805b601f850160051c820191505b8181101561178257828155600101611cad565b505050565b815167ffffffffffffffff811115611cdf57611cdf611815565b611cf381611ced8454611b41565b84611c7a565b602080601f831160018114611d285760008415611d105750858301515b600019600386901b1c1916600185901b178555611782565b600085815260208120601f198616915b82811015611d5757888601518255948401946001909101908401611d38565b5085821015611d755787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60008251611d978184602087016119de565b9190910192915050565b600060208284031215611db357600080fd5b8151801515811461180e57600080fd5b604081526000611dd66040830185611a02565b9050826020830152939250505056fea26469706673582212200b660c799476d68833846726673b6e919e65e41261538f64c948b5b76874533c64736f6c63430008110033";

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
