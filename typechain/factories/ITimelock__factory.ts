/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { ITimelock, ITimelockInterface } from "../ITimelock";

const _abi = [
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
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
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
];

export class ITimelock__factory {
  static readonly abi = _abi;
  static createInterface(): ITimelockInterface {
    return new utils.Interface(_abi) as ITimelockInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ITimelock {
    return new Contract(address, _abi, signerOrProvider) as ITimelock;
  }
}
