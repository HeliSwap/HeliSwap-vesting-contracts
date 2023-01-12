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
  let beneficiariesArray: string[];
  let beneficiariesBalances: BigNumber[];

  let startTimestamp: BigNumber;
  let cliff: BigNumber;
  let freeTokensPercentage: BigNumber;
  let tokensToVest: BigNumber;
  let durationSeconds = BigNumber.from("20");

  before(async function () {
    accounts = await ethers.getSigners();
    const minDelay = BigNumber.from("10");
    // let the beneficiaries and several more addresses be proposers
    const proposers = [accounts[1].address, accounts[2].address, accounts[3].address, accounts[10].address];
    // let the owner and one more address have an executor role
    const executors = [accounts[0].address, accounts[4].address]; 
    const adminAccount = accounts[0]; // e.g. the owner of the vesting contract

    const Timelock = await ethers.getContractFactory("Timelock");
    timelock = await Timelock.deploy(minDelay, proposers, executors, adminAccount.address);
    await timelock.deployed();
  });

  beforeEach(async function () {
    accounts = await ethers.getSigners();

    beneficiariesArray = [accounts[1].address, accounts[2].address, accounts[3].address]; // let the deployer not be present in the beneficiaries array
    // balances are 1 token, 2 tokens and 3 tokens respectively
    beneficiariesBalances = [BigNumber.from("1000000000000000000"), BigNumber.from("2000000000000000000"), BigNumber.from("3000000000000000000")];

    const latestBlockTs = await time.latest();
    startTimestamp = BigNumber.from(latestBlockTs).add(BigNumber.from("5")); // 5 seconds from now
    cliff = BigNumber.from("10"); // cliff will be 5 seconds after start

    freeTokensPercentage = BigNumber.from("10");

    const MockERC20Factory = await ethers.getContractFactory("MockERC20");
    mockERC20 = await MockERC20Factory.deploy();

    await mockERC20.deployed();
    const mockERC20Address = (await mockERC20.deployTransaction.wait())
      .contractAddress;

    const TokenVestingFactory = await ethers.getContractFactory("TokenVesting");
    tokenVesting = await TokenVestingFactory.deploy(
      mockERC20Address,
      timelock.address,
      beneficiariesArray,
      beneficiariesBalances,
      cliff,
      freeTokensPercentage,
      startTimestamp,
      durationSeconds
    );

    await tokenVesting.deployed();
    const vestingContractAddress = (await tokenVesting.deployTransaction.wait())
      .contractAddress;

    tokensToVest = BigNumber.from("6000000000000000000"); // 6 tokens

    mockERC20.transfer(vestingContractAddress, tokensToVest);
  });

  describe("Vesting Deployment", () => {
    it("should be deployed with proper arguments successfully", async function () {
      expect(await tokenVesting.isBeneficiary(accounts[1].address)).to.eq(true);
      expect(await tokenVesting.isBeneficiary(accounts[2].address)).to.eq(true);
      expect(await tokenVesting.isBeneficiary(accounts[3].address)).to.eq(true);

      expect(await tokenVesting.scheduledTokens(accounts[1].address)).to.eq(BigNumber.from("1000000000000000000"));
      expect(await tokenVesting.scheduledTokens(accounts[2].address)).to.eq(BigNumber.from("2000000000000000000"));
      expect(await tokenVesting.scheduledTokens(accounts[3].address)).to.eq(BigNumber.from("3000000000000000000"));

      expect(await tokenVesting.start()).to.equal(startTimestamp);

      expect(await tokenVesting.token()).to.eq(mockERC20.address);
      expect(await tokenVesting.timelock()).to.equal(timelock.address);
      
      expect(await tokenVesting.duration()).to.equal(durationSeconds);
      expect(await tokenVesting.freeTokensPercentage()).to.equal(freeTokensPercentage);
      expect(await tokenVesting.cliff()).to.equal(startTimestamp.add(cliff));
    });
  });

  describe("Vesting", () => {
    it("only owner or beneficiary should be able to claim", async function () {
      await expect(
        tokenVesting.connect(accounts[4]).claim()
      ).to.be.revertedWithCustomError(
        tokenVesting,
        "TokenVesting__OnlyBeneficiaryAndOwnerHaveRights"
      );
    });

    it("should not be able to claim more than initialUnlock amount before start timestamp", async function () {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await tokenVesting.connect(accounts[1]).claim();
      let releasedAmount = await tokenVesting.released(accounts[1].address);

      const acc1ScheduledTokens = await tokenVesting.scheduledTokens(accounts[1].address);

      await expect(releasedAmount).eq(BigNumber.from(acc1ScheduledTokens).div(freeTokensPercentage));

      await tokenVesting.connect(accounts[1]).claim();
      releasedAmount = await tokenVesting.released(accounts[1].address);
      await expect(releasedAmount).eq(BigNumber.from(acc1ScheduledTokens).div(freeTokensPercentage));
    });

    it("should not be able to claim before cliff has expired", async function () {
      await tokenVesting.connect(accounts[2]).claim(); // claim initial unlocked tokens
      await new Promise((resolve) => setTimeout(resolve, 6000));
      await tokenVesting.connect(accounts[2]).claim();

      const releasedAmount = await tokenVesting.released(accounts[2].address);

      const acc2ScheduledTokens = await tokenVesting.scheduledTokens(accounts[2].address);

      await expect(releasedAmount).eq(BigNumber.from(acc2ScheduledTokens).div(freeTokensPercentage));
    });

    it("beneficiary should be able to claim any unlocked tokens after cliff has expired", async function () {
      await tokenVesting.connect(accounts[1]).claim(); // claim initial unlocked tokens
      await new Promise((resolve) => setTimeout(resolve, 15000)); // wait 15 secs

      await expect(tokenVesting.connect(accounts[1]).claim()).to.emit(tokenVesting, "TokensClaimed");
      const releasedAmount = await tokenVesting.released(accounts[1].address);

      const acc1ScheduledTokens = await tokenVesting.scheduledTokens(accounts[1].address);

      await expect(releasedAmount).greaterThan(BigNumber.from(acc1ScheduledTokens).div(freeTokensPercentage));
    });

    it("beneficiary should be able to claim all of the scheduled tokens after the whole duration has expired", async function () {
      let vestingBalance = await mockERC20.balanceOf(tokenVesting.address);
      let beneficiary1Balance = await mockERC20.balanceOf(accounts[1].address);

      expect(vestingBalance).eq(tokensToVest);
      expect(beneficiary1Balance).eq(0);

      const ben1ScheduledTokens = await tokenVesting.scheduledTokens(accounts[1].address);

      const freeTokensCount = BigNumber.from(ben1ScheduledTokens).div(freeTokensPercentage);
      const remainingTokens = ben1ScheduledTokens.sub(freeTokensCount);

      await expect(tokenVesting.connect(accounts[1]).claim()).to.emit(tokenVesting, "TokensClaimed").withArgs(accounts[1].address, freeTokensCount);

      await new Promise((resolve) => setTimeout(resolve, 25000)); // wait at least 20 secs (whole duration)

      await expect(tokenVesting.connect(accounts[1]).claim()).to.emit(tokenVesting, "TokensClaimed").withArgs(accounts[1].address, remainingTokens);

      const releasedAmount = await tokenVesting.released(accounts[1].address);

      await expect(releasedAmount).eq(ben1ScheduledTokens);

      beneficiary1Balance = await mockERC20.balanceOf(accounts[1].address);
      expect(beneficiary1Balance).eq(ben1ScheduledTokens);
    });

    it("updateDuration should revert if not called by the timelock", async function () {
      const currentDuration = await tokenVesting.duration();
      await expect(currentDuration).eq(durationSeconds);

      await expect(tokenVesting.updateDuration(BigNumber.from("200"))).to.be.revertedWithCustomError(tokenVesting,
        "TokenVesting__OnlyCallableByTimelock")
    });

    it("failSafe should revert if not called by the timelock", async function () {
      await expect(tokenVesting.failSafe()).to.be.revertedWithCustomError(tokenVesting,
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
      let ABI = [ "function failSafe()" ];
      let iface = new ethers.utils.Interface(ABI);
      const data = iface.encodeFunctionData("failSafe");

      const zeroBytes32 = ethers.constants.HashZero;
      const salt = ethers.utils.formatBytes32String("2");
      const delay = BigNumber.from("10"); // this adds up to the block.timestamp

      // connect with the beneficiary and make the proposal
      await timelock.connect(accounts[1]).schedule(tokenVesting.address, BigNumber.from("0"), data, zeroBytes32, salt, delay);

      await new Promise((resolve) => setTimeout(resolve, 10000));

      const currentAmount = await mockERC20.balanceOf(tokenVesting.address);
      //const tokensToVest = BigNumber.from("1000000000000000000"); // 1 token
      await expect(currentAmount).eq(tokensToVest);

      const ownerBalanceBefore = await mockERC20.balanceOf(accounts[0].address);

      await timelock.execute(tokenVesting.address, BigNumber.from("0"), data, zeroBytes32, salt);

      const newAmount = await mockERC20.balanceOf(tokenVesting.address);

      await expect(newAmount).eq(BigNumber.from("0"));

      const ownerBalanceAfter = await mockERC20.balanceOf(accounts[0].address);

      // ensure tokens are transferred backed to the owner after a fail safe
      expect(ownerBalanceAfter).eq(ownerBalanceBefore.add(tokensToVest));

    });

    it("owner should be able to add more tokens for distribution", async function () {
      let vestingBalance = await mockERC20.balanceOf(tokenVesting.address);
      expect(vestingBalance).eq(tokensToVest);

      const tokensToAdd = BigNumber.from("1000000000000000000"); // 1 more token to add 

      const ben2ScheduledTokensBefore = await tokenVesting.scheduledTokens(accounts[2].address);

      const beneficiaries = [];
      const balances = [];

      for(let i = 0;i < 1000; i++) {
        beneficiaries.push(accounts[i].address);
        balances.push(tokensToAdd);
      }

      await expect(tokenVesting.connect(accounts[5]).addTokens(beneficiaries, balances)).to.be.revertedWith("Ownable: caller is not the owner");

      // await mockERC20.increaseAllowance(tokenVesting.address, tokensToAdd);
      // add 1 more token to beneficiary #2
      await expect(tokenVesting.addTokens(beneficiaries, balances)).to.not.be.reverted;

      const ben2ScheduledTokensAfter = await tokenVesting.scheduledTokens(accounts[2].address);
      expect(ben2ScheduledTokensAfter).eq(ben2ScheduledTokensBefore.add(tokensToAdd));

      //vestingBalance = await mockERC20.balanceOf(tokenVesting.address);
      //expect(vestingBalance).eq(tokensToVest.add(tokensToAdd));

      //await mockERC20.increaseAllowance(tokenVesting.address, tokensToAdd);

      //const ben3ScheduledTokensBefore = await tokenVesting.scheduledTokens(accounts[3].address);

      // add 1 more token to beneficiary #3
      //await expect(tokenVesting.addTokens([accounts[3].address], [tokensToAdd])).to.not.be.reverted;

      //const ben3ScheduledTokensAfter = await tokenVesting.scheduledTokens(accounts[3].address);
      //expect(ben3ScheduledTokensAfter).eq(ben3ScheduledTokensBefore.add(tokensToAdd));

      //vestingBalance = await mockERC20.balanceOf(tokenVesting.address);
      //expect(vestingBalance).eq(tokensToVest.add(tokensToAdd.mul(2)));
    });

    it("only owner should be able to change timelock address", async function () {
      const currentTimelockAddr = await tokenVesting.timelock();
      await expect(currentTimelockAddr).eq(timelock.address);

      await expect(tokenVesting.connect(accounts[1]).changeTimelockAddress(accounts[15].address)).to.be.revertedWith("Ownable: caller is not the owner");

      await expect(tokenVesting.changeTimelockAddress(accounts[15].address)).to.be.emit(tokenVesting, "TimelockAddressChanged").withArgs(currentTimelockAddr, accounts[15].address);
    });
  });
});
