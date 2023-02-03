/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Errors, ErrorsInterface } from "../Errors";

const _abi = [
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
];

const _bytecode =
  "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea26469706673582212206ffb1a0ee5f3aea72436c06121bcd6e1985a20bb9bfaa217e13df5dff02131e064736f6c63430008110033";

export class Errors__factory extends ContractFactory {
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
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Errors> {
    return super.deploy(overrides || {}) as Promise<Errors>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Errors {
    return super.attach(address) as Errors;
  }
  connect(signer: Signer): Errors__factory {
    return super.connect(signer) as Errors__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ErrorsInterface {
    return new utils.Interface(_abi) as ErrorsInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Errors {
    return new Contract(address, _abi, signerOrProvider) as Errors;
  }
}
