/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface ClaimDropInterface extends ethers.utils.Interface {
  functions: {
    "addBeneficiaries(address[],uint256[])": FunctionFragment;
    "claim()": FunctionFragment;
    "claimExtraTime()": FunctionFragment;
    "claimable(address)": FunctionFragment;
    "claimedOf(address)": FunctionFragment;
    "cliffEnd()": FunctionFragment;
    "divest()": FunctionFragment;
    "end()": FunctionFragment;
    "extraTokensOf(address)": FunctionFragment;
    "failMode()": FunctionFragment;
    "failSafe()": FunctionFragment;
    "fund(uint256)": FunctionFragment;
    "index()": FunctionFragment;
    "lockTime()": FunctionFragment;
    "locks(bytes4)": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "schedule(bytes4,bytes)": FunctionFragment;
    "start()": FunctionFragment;
    "startVesting(uint256,uint256,uint256)": FunctionFragment;
    "token()": FunctionFragment;
    "tokensNotVestedPercentage()": FunctionFragment;
    "totalAllocated()": FunctionFragment;
    "totalAllocatedOf(address)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "updateDuration()": FunctionFragment;
    "vestedTokensOf(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "addBeneficiaries",
    values: [string[], BigNumberish[]]
  ): string;
  encodeFunctionData(functionFragment: "claim", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "claimExtraTime",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "claimable", values: [string]): string;
  encodeFunctionData(functionFragment: "claimedOf", values: [string]): string;
  encodeFunctionData(functionFragment: "cliffEnd", values?: undefined): string;
  encodeFunctionData(functionFragment: "divest", values?: undefined): string;
  encodeFunctionData(functionFragment: "end", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "extraTokensOf",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "failMode", values?: undefined): string;
  encodeFunctionData(functionFragment: "failSafe", values?: undefined): string;
  encodeFunctionData(functionFragment: "fund", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "index", values?: undefined): string;
  encodeFunctionData(functionFragment: "lockTime", values?: undefined): string;
  encodeFunctionData(functionFragment: "locks", values: [BytesLike]): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "schedule",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "start", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "startVesting",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "token", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "tokensNotVestedPercentage",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalAllocated",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalAllocatedOf",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "updateDuration",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "vestedTokensOf",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "addBeneficiaries",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "claim", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "claimExtraTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "claimable", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claimedOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "cliffEnd", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "divest", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "end", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "extraTokensOf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "failMode", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "failSafe", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "fund", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "index", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "lockTime", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "locks", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "schedule", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "start", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "startVesting",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "token", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "tokensNotVestedPercentage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalAllocated",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalAllocatedOf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateDuration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "vestedTokensOf",
    data: BytesLike
  ): Result;

  events: {
    "BeneficiariesAdded(address[],uint256[])": EventFragment;
    "Divest(uint256)": EventFragment;
    "DurationUpdated(uint256,uint256)": EventFragment;
    "FailSafeOccurred(uint256)": EventFragment;
    "Funded(uint256,uint256,uint256)": EventFragment;
    "LockSheduled(bytes4,uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "TokensClaimed(address,uint256)": EventFragment;
    "VestingStarted(uint256,uint256,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "BeneficiariesAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Divest"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DurationUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "FailSafeOccurred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Funded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LockSheduled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TokensClaimed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "VestingStarted"): EventFragment;
}

export type BeneficiariesAddedEvent = TypedEvent<
  [string[], BigNumber[]] & { beneficiaries: string[]; balances: BigNumber[] }
>;

export type DivestEvent = TypedEvent<[BigNumber] & { amount: BigNumber }>;

export type DurationUpdatedEvent = TypedEvent<
  [BigNumber, BigNumber] & { vestingDuration: BigNumber; end: BigNumber }
>;

export type FailSafeOccurredEvent = TypedEvent<
  [BigNumber] & { safeAmount: BigNumber }
>;

export type FundedEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber] & {
    amount: BigNumber;
    index: BigNumber;
    totalAllocated: BigNumber;
  }
>;

export type LockSheduledEvent = TypedEvent<
  [string, BigNumber] & { fn: string; schedule: BigNumber }
>;

export type OwnershipTransferredEvent = TypedEvent<
  [string, string] & { previousOwner: string; newOwner: string }
>;

export type TokensClaimedEvent = TypedEvent<
  [string, BigNumber] & { claimer: string; amountClaimed: BigNumber }
>;

export type VestingStartedEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber, BigNumber] & {
    start: BigNumber;
    end: BigNumber;
    cliffEnd: BigNumber;
    claimExtraDuration: BigNumber;
  }
>;

export class ClaimDrop extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: ClaimDropInterface;

  functions: {
    addBeneficiaries(
      beneficiaries: string[],
      balances: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    claim(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    claimExtraTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    claimable(
      beneficiary: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { availableAllocated: BigNumber }>;

    claimedOf(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    cliffEnd(overrides?: CallOverrides): Promise<[BigNumber]>;

    divest(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    end(overrides?: CallOverrides): Promise<[BigNumber]>;

    extraTokensOf(
      beneficiary: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    failMode(overrides?: CallOverrides): Promise<[boolean]>;

    failSafe(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    fund(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    index(overrides?: CallOverrides): Promise<[BigNumber]>;

    lockTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    locks(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber, string] & { schedule: BigNumber; params: string }>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    schedule(
      fn: BytesLike,
      params: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    start(overrides?: CallOverrides): Promise<[BigNumber]>;

    startVesting(
      vestingDuration: BigNumberish,
      cliffDuration: BigNumberish,
      claimExtraDuration: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    token(overrides?: CallOverrides): Promise<[string]>;

    tokensNotVestedPercentage(overrides?: CallOverrides): Promise<[BigNumber]>;

    totalAllocated(overrides?: CallOverrides): Promise<[BigNumber]>;

    totalAllocatedOf(
      beneficiary: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateDuration(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    vestedTokensOf(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  addBeneficiaries(
    beneficiaries: string[],
    balances: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  claim(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  claimExtraTime(overrides?: CallOverrides): Promise<BigNumber>;

  claimable(beneficiary: string, overrides?: CallOverrides): Promise<BigNumber>;

  claimedOf(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  cliffEnd(overrides?: CallOverrides): Promise<BigNumber>;

  divest(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  end(overrides?: CallOverrides): Promise<BigNumber>;

  extraTokensOf(
    beneficiary: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  failMode(overrides?: CallOverrides): Promise<boolean>;

  failSafe(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  fund(
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  index(overrides?: CallOverrides): Promise<BigNumber>;

  lockTime(overrides?: CallOverrides): Promise<BigNumber>;

  locks(
    arg0: BytesLike,
    overrides?: CallOverrides
  ): Promise<[BigNumber, string] & { schedule: BigNumber; params: string }>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  schedule(
    fn: BytesLike,
    params: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  start(overrides?: CallOverrides): Promise<BigNumber>;

  startVesting(
    vestingDuration: BigNumberish,
    cliffDuration: BigNumberish,
    claimExtraDuration: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  token(overrides?: CallOverrides): Promise<string>;

  tokensNotVestedPercentage(overrides?: CallOverrides): Promise<BigNumber>;

  totalAllocated(overrides?: CallOverrides): Promise<BigNumber>;

  totalAllocatedOf(
    beneficiary: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateDuration(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  vestedTokensOf(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    addBeneficiaries(
      beneficiaries: string[],
      balances: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    claim(overrides?: CallOverrides): Promise<void>;

    claimExtraTime(overrides?: CallOverrides): Promise<BigNumber>;

    claimable(
      beneficiary: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    claimedOf(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    cliffEnd(overrides?: CallOverrides): Promise<BigNumber>;

    divest(overrides?: CallOverrides): Promise<void>;

    end(overrides?: CallOverrides): Promise<BigNumber>;

    extraTokensOf(
      beneficiary: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    failMode(overrides?: CallOverrides): Promise<boolean>;

    failSafe(overrides?: CallOverrides): Promise<void>;

    fund(amount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    index(overrides?: CallOverrides): Promise<BigNumber>;

    lockTime(overrides?: CallOverrides): Promise<BigNumber>;

    locks(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber, string] & { schedule: BigNumber; params: string }>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    schedule(
      fn: BytesLike,
      params: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    start(overrides?: CallOverrides): Promise<BigNumber>;

    startVesting(
      vestingDuration: BigNumberish,
      cliffDuration: BigNumberish,
      claimExtraDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    token(overrides?: CallOverrides): Promise<string>;

    tokensNotVestedPercentage(overrides?: CallOverrides): Promise<BigNumber>;

    totalAllocated(overrides?: CallOverrides): Promise<BigNumber>;

    totalAllocatedOf(
      beneficiary: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    updateDuration(overrides?: CallOverrides): Promise<void>;

    vestedTokensOf(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {
    "BeneficiariesAdded(address[],uint256[])"(
      beneficiaries?: null,
      balances?: null
    ): TypedEventFilter<
      [string[], BigNumber[]],
      { beneficiaries: string[]; balances: BigNumber[] }
    >;

    BeneficiariesAdded(
      beneficiaries?: null,
      balances?: null
    ): TypedEventFilter<
      [string[], BigNumber[]],
      { beneficiaries: string[]; balances: BigNumber[] }
    >;

    "Divest(uint256)"(
      amount?: null
    ): TypedEventFilter<[BigNumber], { amount: BigNumber }>;

    Divest(amount?: null): TypedEventFilter<[BigNumber], { amount: BigNumber }>;

    "DurationUpdated(uint256,uint256)"(
      vestingDuration?: null,
      end?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber],
      { vestingDuration: BigNumber; end: BigNumber }
    >;

    DurationUpdated(
      vestingDuration?: null,
      end?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber],
      { vestingDuration: BigNumber; end: BigNumber }
    >;

    "FailSafeOccurred(uint256)"(
      safeAmount?: null
    ): TypedEventFilter<[BigNumber], { safeAmount: BigNumber }>;

    FailSafeOccurred(
      safeAmount?: null
    ): TypedEventFilter<[BigNumber], { safeAmount: BigNumber }>;

    "Funded(uint256,uint256,uint256)"(
      amount?: null,
      index?: null,
      totalAllocated?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber, BigNumber],
      { amount: BigNumber; index: BigNumber; totalAllocated: BigNumber }
    >;

    Funded(
      amount?: null,
      index?: null,
      totalAllocated?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber, BigNumber],
      { amount: BigNumber; index: BigNumber; totalAllocated: BigNumber }
    >;

    "LockSheduled(bytes4,uint256)"(
      fn?: null,
      schedule?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { fn: string; schedule: BigNumber }
    >;

    LockSheduled(
      fn?: null,
      schedule?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { fn: string; schedule: BigNumber }
    >;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    "TokensClaimed(address,uint256)"(
      claimer?: null,
      amountClaimed?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { claimer: string; amountClaimed: BigNumber }
    >;

    TokensClaimed(
      claimer?: null,
      amountClaimed?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { claimer: string; amountClaimed: BigNumber }
    >;

    "VestingStarted(uint256,uint256,uint256,uint256)"(
      start?: null,
      end?: null,
      cliffEnd?: null,
      claimExtraDuration?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber, BigNumber, BigNumber],
      {
        start: BigNumber;
        end: BigNumber;
        cliffEnd: BigNumber;
        claimExtraDuration: BigNumber;
      }
    >;

    VestingStarted(
      start?: null,
      end?: null,
      cliffEnd?: null,
      claimExtraDuration?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber, BigNumber, BigNumber],
      {
        start: BigNumber;
        end: BigNumber;
        cliffEnd: BigNumber;
        claimExtraDuration: BigNumber;
      }
    >;
  };

  estimateGas: {
    addBeneficiaries(
      beneficiaries: string[],
      balances: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    claim(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    claimExtraTime(overrides?: CallOverrides): Promise<BigNumber>;

    claimable(
      beneficiary: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    claimedOf(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    cliffEnd(overrides?: CallOverrides): Promise<BigNumber>;

    divest(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    end(overrides?: CallOverrides): Promise<BigNumber>;

    extraTokensOf(
      beneficiary: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    failMode(overrides?: CallOverrides): Promise<BigNumber>;

    failSafe(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    fund(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    index(overrides?: CallOverrides): Promise<BigNumber>;

    lockTime(overrides?: CallOverrides): Promise<BigNumber>;

    locks(arg0: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    schedule(
      fn: BytesLike,
      params: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    start(overrides?: CallOverrides): Promise<BigNumber>;

    startVesting(
      vestingDuration: BigNumberish,
      cliffDuration: BigNumberish,
      claimExtraDuration: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    token(overrides?: CallOverrides): Promise<BigNumber>;

    tokensNotVestedPercentage(overrides?: CallOverrides): Promise<BigNumber>;

    totalAllocated(overrides?: CallOverrides): Promise<BigNumber>;

    totalAllocatedOf(
      beneficiary: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateDuration(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    vestedTokensOf(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    addBeneficiaries(
      beneficiaries: string[],
      balances: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    claim(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    claimExtraTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    claimable(
      beneficiary: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    claimedOf(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    cliffEnd(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    divest(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    end(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    extraTokensOf(
      beneficiary: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    failMode(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    failSafe(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    fund(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    index(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    lockTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    locks(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    schedule(
      fn: BytesLike,
      params: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    start(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    startVesting(
      vestingDuration: BigNumberish,
      cliffDuration: BigNumberish,
      claimExtraDuration: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    token(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tokensNotVestedPercentage(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    totalAllocated(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalAllocatedOf(
      beneficiary: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateDuration(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    vestedTokensOf(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}