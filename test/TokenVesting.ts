import { BigNumber } from "ethers";

import { ethers } from "hardhat";

import { time } from "@nomicfoundation/hardhat-network-helpers";

import { expect } from "chai";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Timelock, TokenVesting, MockERC20 } from "../typechain-types";

describe("TokenVesting", function () {
  let tokenVesting: TokenVesting;
  let timelock: Timelock;
  let mockERC20: MockERC20;
  let accounts: SignerWithAddress[];
  let beneficiaryAccount: SignerWithAddress;

  let startTimestamp: BigNumber;
  let cliff: BigNumber;
  let freeTokensCount: BigNumber;
  let tokensToVest: BigNumber;
  let durationSeconds = BigNumber.from("20");

  before(async function () {
    accounts = await ethers.getSigners();
    const minDelay = BigNumber.from("10");
    // let the beneficiary and one more address be proposers
    const proposers = [accounts[1].address, accounts[2].address];
    // let the owner and one more address have an executor role
    const executors = [accounts[0].address, accounts[3].address]; 
    const adminAccount = accounts[0]; // e.g. the owner of the vesting contract

    const Timelock = await ethers.getContractFactory("Timelock");
    timelock = await Timelock.deploy(minDelay, proposers, executors, adminAccount.address);
    await timelock.deployed();
  });

  beforeEach(async function () {
    accounts = await ethers.getSigners();

    beneficiaryAccount = accounts[1]; // let the beneficiary for testing be != deployer

    const latestBlockTs = await time.latest();
    startTimestamp = BigNumber.from(latestBlockTs).add(BigNumber.from("5")); // 5 seconds from now
    cliff = BigNumber.from("5"); // cliff will be 5 seconds after start

    freeTokensCount = BigNumber.from("500000000000000000"); // 0.5

    const TokenVestingFactory = await ethers.getContractFactory("TokenVesting");
    tokenVesting = await TokenVestingFactory.deploy(
      timelock.address,
      beneficiaryAccount.address,
      cliff,
      freeTokensCount,
      startTimestamp,
      durationSeconds,
    );

    await tokenVesting.deployed();
    const vestingContractAddress = (await tokenVesting.deployTransaction.wait())
      .contractAddress;
    console.log("Vesting Contract Address: ", vestingContractAddress);

    const MockERC20Factory = await ethers.getContractFactory("MockERC20");
    mockERC20 = await MockERC20Factory.deploy();

    await mockERC20.deployed();
    const mockERC20Address = (await mockERC20.deployTransaction.wait())
      .contractAddress;
    console.log("MockERC20 Address: ", mockERC20Address);

    tokensToVest = BigNumber.from("1000000000000000000"); // 1 token

    mockERC20.transfer(vestingContractAddress, tokensToVest);
  });

  describe("Vesting Deployment", () => {
    it("should be deployed with proper arguments successfully", async function () {
      expect(await tokenVesting.beneficiary()).to.equal(
        beneficiaryAccount.address
      );
      expect(await tokenVesting.start()).to.equal(startTimestamp);
      expect(await tokenVesting.timelock()).to.equal(timelock.address);
      expect(await tokenVesting.duration()).to.equal(durationSeconds);
      expect(await tokenVesting.freeTokens()).to.equal(freeTokensCount);
      expect(await tokenVesting.cliff()).to.equal(startTimestamp.add(cliff));
    });
  });

  describe("Vesting", () => {
    it("only owner or beneficiary should be able to claim", async function () {
      await expect(
        tokenVesting.connect(accounts[2]).release(mockERC20.address)
      ).to.be.revertedWithCustomError(
        tokenVesting,
        "TokenVesting__OnlyBeneficiaryAndOwnerHaveRights"
      );
    });

    it("should not be able to claim before start timestamp", async function () {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await tokenVesting.release(mockERC20.address);
      const releasedAmount = await tokenVesting.released(mockERC20.address);
      await expect(releasedAmount).eq(0);
    });

    it("should not be able to claim before cliff has expired", async function () {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await tokenVesting.release(mockERC20.address);
      const releasedAmount = await tokenVesting.released(mockERC20.address);
      await expect(releasedAmount).eq(0);
    });

    it("should be able to claim free tokens at any time", async function () {
      const totalFreeTokens = await tokenVesting.freeTokens();
      await expect(totalFreeTokens).eq(freeTokensCount);

      await tokenVesting.releaseFreeTokens(mockERC20.address);
      const releasedAmount = await tokenVesting.released(mockERC20.address);

      await expect(releasedAmount).eq(totalFreeTokens);
    });

    it("beneficiary should be able to claim any unlocked tokens after cliff has expired", async function () {
      await new Promise((resolve) => setTimeout(resolve, 10000)); // wait 10 secs

      await expect(tokenVesting.release(mockERC20.address)).to.emit(tokenVesting, "ERC20Released");
      const releasedAmount = await tokenVesting.released(mockERC20.address);

      await expect(releasedAmount).not.eq(0);
    });

    it("beneficiary should be able to claim all of the scheduled tokens after the whole duration has expired", async function () {
      let vestingBalance = await mockERC20.balanceOf(tokenVesting.address);
      let beneficiaryBalance = await mockERC20.balanceOf(beneficiaryAccount.address);

      expect(vestingBalance).eq(tokensToVest);
      expect(beneficiaryBalance).eq(0);

      await new Promise((resolve) => setTimeout(resolve, 25000)); // wait at least 20 secs (whole duration)

      await expect(tokenVesting.releaseFreeTokens(mockERC20.address)).to.emit(tokenVesting, "ERC20Released").withArgs(mockERC20.address, freeTokensCount);

      await expect(tokenVesting.release(mockERC20.address)).to.emit(tokenVesting, "ERC20Released");
      const releasedAmount = await tokenVesting.released(mockERC20.address);

      await expect(releasedAmount).not.eq(0);

      vestingBalance = await mockERC20.balanceOf(tokenVesting.address);
      expect(vestingBalance).eq(0);

      beneficiaryBalance = await mockERC20.balanceOf(beneficiaryAccount.address);
      expect(beneficiaryBalance).eq(tokensToVest);
    });

    it("updateDuration should revert if not called by the timelock", async function () {
      const currentDuration = await tokenVesting.duration();
      await expect(currentDuration).eq(durationSeconds);

      await expect(tokenVesting.updateDuration(BigNumber.from("200"))).to.be.revertedWithCustomError(tokenVesting,
        "TokenVesting__OnlyCallableByTimelock")
    });

    it("failSafe should revert if not called by the timelock", async function () {
      await expect(tokenVesting.failSafe(mockERC20.address)).to.be.revertedWithCustomError(tokenVesting,
        "TokenVesting__OnlyCallableByTimelock")
    });

    it("timelock should fail changing the duration if the delay hasn't passed", async function () {
      let ABI = [ "function updateDuration(uint64 duration)" ]; // try only with uint if fails
      let iface = new ethers.utils.Interface(ABI);
      const data = iface.encodeFunctionData("updateDuration", [BigNumber.from("200")]);

      const zeroBytes32 = ethers.constants.HashZero;
      const salt = ethers.utils.formatBytes32String("1"); // try with bytes32 if fails
      const delay = BigNumber.from("10"); // this adds up to the block.timestamp

      // connect with the beneficiary and make the proposal
      await timelock.connect(accounts[1]).schedule(tokenVesting.address, BigNumber.from("0"), data, zeroBytes32, salt, delay);

      await new Promise((resolve) => setTimeout(resolve, 5000)); // wait 5 seconds

      const currentDuration = await tokenVesting.duration();
      await expect(currentDuration).eq(durationSeconds);

      await expect(timelock.execute(tokenVesting.address, BigNumber.from("0"), data, zeroBytes32, salt)).to.be.revertedWith("TimelockController: operation is not ready");
    });

    it("timelock should fail executing updateDuration if the user does not have an executor role", async function () {
      let ABI = [ "function updateDuration(uint64 duration)" ]; // try only with uint if fails
      let iface = new ethers.utils.Interface(ABI);
      const data = iface.encodeFunctionData("updateDuration", [BigNumber.from("200")]);

      const zeroBytes32 = ethers.constants.HashZero;
      const salt = ethers.utils.formatBytes32String("1"); // try with bytes32 if fails
      const delay = BigNumber.from("10"); // this adds up to the block.timestamp

      // connect with the beneficiary and make the proposal
      await timelock.connect(accounts[1]).schedule(tokenVesting.address, BigNumber.from("0"), data, zeroBytes32, salt, delay);

      await new Promise((resolve) => setTimeout(resolve, 10000));

      const currentDuration = await tokenVesting.duration();
      await expect(currentDuration).eq(durationSeconds);

      await expect(timelock.connect(accounts[5]).execute(tokenVesting.address, BigNumber.from("0"), data, zeroBytes32, salt)).to.be.reverted;
    });

    it("timelock should successfully change duration", async function () {
      let ABI = [ "function updateDuration(uint64 duration)" ];
      let iface = new ethers.utils.Interface(ABI);
      const data = iface.encodeFunctionData("updateDuration", [BigNumber.from("200")]);

      const zeroBytes32 = ethers.constants.HashZero;
      const salt = ethers.utils.formatBytes32String("1");
      const delay = BigNumber.from("10"); // this adds up to the block.timestamp

      // connect with the beneficiary and make the proposal
      await timelock.connect(accounts[1]).schedule(tokenVesting.address, BigNumber.from("0"), data, zeroBytes32, salt, delay);

      await new Promise((resolve) => setTimeout(resolve, 10000));

      const currentDuration = await tokenVesting.duration();
      await expect(currentDuration).eq(durationSeconds);

      await timelock.execute(tokenVesting.address, BigNumber.from("0"), data, zeroBytes32, salt);

      const newDuration = await tokenVesting.duration();

      await expect(newDuration).eq(BigNumber.from("200"));
    });

    it("timelock should successfully operate a failSafe", async function () {
      let ABI = [ "function failSafe(address token)" ];
      let iface = new ethers.utils.Interface(ABI);
      const data = iface.encodeFunctionData("failSafe", [mockERC20.address]);

      const zeroBytes32 = ethers.constants.HashZero;
      const salt = ethers.utils.formatBytes32String("2");
      const delay = BigNumber.from("10"); // this adds up to the block.timestamp

      // connect with the beneficiary and make the proposal
      await timelock.connect(accounts[1]).schedule(tokenVesting.address, BigNumber.from("0"), data, zeroBytes32, salt, delay);

      await new Promise((resolve) => setTimeout(resolve, 10000));

      const currentAmount = await mockERC20.balanceOf(tokenVesting.address);
      const tokensToVest = BigNumber.from("1000000000000000000"); // 1 token
      await expect(currentAmount).eq(tokensToVest);

      await timelock.execute(tokenVesting.address, BigNumber.from("0"), data, zeroBytes32, salt);

      const newAmount = await mockERC20.balanceOf(tokenVesting.address);

      await expect(newAmount).eq(BigNumber.from("0"));
    });

    it("owner should be able to add more tokens for distribution", async function () {
      let totalFreeTokens = await tokenVesting.freeTokens();
      await expect(totalFreeTokens).eq(freeTokensCount);

      let vestingBalance = await mockERC20.balanceOf(tokenVesting.address);
      expect(vestingBalance).eq(tokensToVest);

      const tokensToAdd = BigNumber.from("1000000000000000000");

      await expect(tokenVesting.connect(accounts[5]).addTokens(mockERC20.address, tokensToAdd, 0)).to.be.revertedWith("Ownable: caller is not the owner");

      await mockERC20.increaseAllowance(tokenVesting.address, tokensToAdd);
      // add 1 more token, 0 free 
      await expect(tokenVesting.addTokens(mockERC20.address, tokensToAdd, 0)).to.emit(tokenVesting, "TokensIncreased").withArgs(mockERC20.address, tokensToAdd);

      vestingBalance = await mockERC20.balanceOf(tokenVesting.address);
      expect(vestingBalance).eq(tokensToVest.add(tokensToAdd));

      await mockERC20.increaseAllowance(tokenVesting.address, tokensToAdd);

      // add 1 more token, 0.5 free 
      await expect(tokenVesting.addTokens(mockERC20.address, tokensToAdd, BigNumber.from("500000000000000000"))).to.emit(tokenVesting, "TokensIncreased").withArgs(mockERC20.address, tokensToAdd);

      vestingBalance = await mockERC20.balanceOf(tokenVesting.address);
      expect(vestingBalance).eq(tokensToVest.add(tokensToAdd.mul(2)));

      totalFreeTokens = await tokenVesting.freeTokens();
      await expect(totalFreeTokens).eq(freeTokensCount.add(BigNumber.from("500000000000000000")));
    });
  });
});
