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
import type { Timelock, TimelockInterface } from "../Timelock";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "defaultTimeLock",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
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
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040516200106638038062001066833981810160405281019062000037919062000171565b620000576200004b6200006560201b60201c565b6200006d60201b60201c565b8060018190555050620001a3565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600080fd5b6000819050919050565b6200014b8162000136565b81146200015757600080fd5b50565b6000815190506200016b8162000140565b92915050565b6000602082840312156200018a576200018962000131565b5b60006200019a848285016200015a565b91505092915050565b610eb380620001b36000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c80630d66808714610067578063715018a6146100855780638da5cb5b1461008f578063b59432fa146100ad578063f2fde38b146100de578063fc609d63146100fa575b600080fd5b61006f610116565b60405161007c91906106e2565b60405180910390f35b61008d61011c565b005b6100976101a4565b6040516100a4919061073e565b60405180910390f35b6100c760048036038101906100c291906107bb565b6101cd565b6040516100d5929190610878565b60405180910390f35b6100f860048036038101906100f391906108d4565b610279565b005b610114600480360381019061010f9190610966565b610370565b005b60015481565b6101246105fd565b73ffffffffffffffffffffffffffffffffffffffff166101426101a4565b73ffffffffffffffffffffffffffffffffffffffff1614610198576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161018f90610a23565b60405180910390fd5b6101a26000610605565b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60026020528060005260406000206000915090508060000154908060010180546101f690610a72565b80601f016020809104026020016040519081016040528092919081815260200182805461022290610a72565b801561026f5780601f106102445761010080835404028352916020019161026f565b820191906000526020600020905b81548152906001019060200180831161025257829003601f168201915b5050505050905082565b6102816105fd565b73ffffffffffffffffffffffffffffffffffffffff1661029f6101a4565b73ffffffffffffffffffffffffffffffffffffffff16146102f5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102ec90610a23565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610364576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161035b90610b15565b60405180910390fd5b61036d81610605565b50565b6103786105fd565b73ffffffffffffffffffffffffffffffffffffffff166103966101a4565b73ffffffffffffffffffffffffffffffffffffffff16146103ec576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103e390610a23565b60405180910390fd5b4260026000857bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000154106104d85760026000847bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600001546040517f6f0005b00000000000000000000000000000000000000000000000000000000081526004016104cf91906106e2565b60405180910390fd5b6040518060400160405280600154426104f19190610b64565b815260200183838080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505081525060026000857bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000206000820151816000015560208201518160010190816105ae9190610d73565b509050507f369c03d42edb1a921b8b310009b29200b4baab8aece683a6d3a7e7bca855fe1183600154426105e29190610b64565b6040516105f0929190610e54565b60405180910390a1505050565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b6000819050919050565b6106dc816106c9565b82525050565b60006020820190506106f760008301846106d3565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610728826106fd565b9050919050565b6107388161071d565b82525050565b6000602082019050610753600083018461072f565b92915050565b600080fd5b600080fd5b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b61079881610763565b81146107a357600080fd5b50565b6000813590506107b58161078f565b92915050565b6000602082840312156107d1576107d0610759565b5b60006107df848285016107a6565b91505092915050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610822578082015181840152602081019050610807565b60008484015250505050565b6000601f19601f8301169050919050565b600061084a826107e8565b61085481856107f3565b9350610864818560208601610804565b61086d8161082e565b840191505092915050565b600060408201905061088d60008301856106d3565b818103602083015261089f818461083f565b90509392505050565b6108b18161071d565b81146108bc57600080fd5b50565b6000813590506108ce816108a8565b92915050565b6000602082840312156108ea576108e9610759565b5b60006108f8848285016108bf565b91505092915050565b600080fd5b600080fd5b600080fd5b60008083601f84011261092657610925610901565b5b8235905067ffffffffffffffff81111561094357610942610906565b5b60208301915083600182028301111561095f5761095e61090b565b5b9250929050565b60008060006040848603121561097f5761097e610759565b5b600061098d868287016107a6565b935050602084013567ffffffffffffffff8111156109ae576109ad61075e565b5b6109ba86828701610910565b92509250509250925092565b600082825260208201905092915050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b6000610a0d6020836109c6565b9150610a18826109d7565b602082019050919050565b60006020820190508181036000830152610a3c81610a00565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680610a8a57607f821691505b602082108103610a9d57610a9c610a43565b5b50919050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b6000610aff6026836109c6565b9150610b0a82610aa3565b604082019050919050565b60006020820190508181036000830152610b2e81610af2565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610b6f826106c9565b9150610b7a836106c9565b9250828201905080821115610b9257610b91610b35565b5b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302610c297fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610bec565b610c338683610bec565b95508019841693508086168417925050509392505050565b6000819050919050565b6000610c70610c6b610c66846106c9565b610c4b565b6106c9565b9050919050565b6000819050919050565b610c8a83610c55565b610c9e610c9682610c77565b848454610bf9565b825550505050565b600090565b610cb3610ca6565b610cbe818484610c81565b505050565b5b81811015610ce257610cd7600082610cab565b600181019050610cc4565b5050565b601f821115610d2757610cf881610bc7565b610d0184610bdc565b81016020851015610d10578190505b610d24610d1c85610bdc565b830182610cc3565b50505b505050565b600082821c905092915050565b6000610d4a60001984600802610d2c565b1980831691505092915050565b6000610d638383610d39565b9150826002028217905092915050565b610d7c826107e8565b67ffffffffffffffff811115610d9557610d94610b98565b5b610d9f8254610a72565b610daa828285610ce6565b600060209050601f831160018114610ddd5760008415610dcb578287015190505b610dd58582610d57565b865550610e3d565b601f198416610deb86610bc7565b60005b82811015610e1357848901518255600182019150602085019450602081019050610dee565b86831015610e305784890151610e2c601f891682610d39565b8355505b6001600288020188555050505b505050505050565b610e4e81610763565b82525050565b6000604082019050610e696000830185610e45565b610e7660208301846106d3565b939250505056fea2646970667358221220486bb6d8f398395abe837e208f220ac9211e0f07240a6ed79cfee2e0cfa7933764736f6c63430008110033";

export class Timelock__factory extends ContractFactory {
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
    defaultTimeLock: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Timelock> {
    return super.deploy(defaultTimeLock, overrides || {}) as Promise<Timelock>;
  }
  getDeployTransaction(
    defaultTimeLock: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(defaultTimeLock, overrides || {});
  }
  attach(address: string): Timelock {
    return super.attach(address) as Timelock;
  }
  connect(signer: Signer): Timelock__factory {
    return super.connect(signer) as Timelock__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TimelockInterface {
    return new utils.Interface(_abi) as TimelockInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Timelock {
    return new Contract(address, _abi, signerOrProvider) as Timelock;
  }
}