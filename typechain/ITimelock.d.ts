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

interface ITimelockInterface extends ethers.utils.Interface {
  functions: {
    "lockTime()": FunctionFragment;
    "locks(bytes4)": FunctionFragment;
    "schedule(bytes4,bytes)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "lockTime", values?: undefined): string;
  encodeFunctionData(functionFragment: "locks", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "schedule",
    values: [BytesLike, BytesLike]
  ): string;

  decodeFunctionResult(functionFragment: "lockTime", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "locks", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "schedule", data: BytesLike): Result;

  events: {
    "LockSheduled(bytes4,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "LockSheduled"): EventFragment;
}

export type LockSheduledEvent = TypedEvent<
  [string, BigNumber] & { fn: string; schedule: BigNumber }
>;

export class ITimelock extends BaseContract {
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

  interface: ITimelockInterface;

  functions: {
    lockTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    locks(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber, string]>;

    schedule(
      fn: BytesLike,
      params: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  lockTime(overrides?: CallOverrides): Promise<BigNumber>;

  locks(
    arg0: BytesLike,
    overrides?: CallOverrides
  ): Promise<[BigNumber, string]>;

  schedule(
    fn: BytesLike,
    params: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    lockTime(overrides?: CallOverrides): Promise<BigNumber>;

    locks(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber, string]>;

    schedule(
      fn: BytesLike,
      params: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
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
  };

  estimateGas: {
    lockTime(overrides?: CallOverrides): Promise<BigNumber>;

    locks(arg0: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    schedule(
      fn: BytesLike,
      params: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    lockTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    locks(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    schedule(
      fn: BytesLike,
      params: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
