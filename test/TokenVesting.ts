import { BigNumber } from "ethers";

import { ethers } from "hardhat";

//import { time } from "@nomicfoundation/hardhat-network-helpers";

// import * as time from '../utils/time';

import { expect } from "chai";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Timelock, TokenVesting, MockERC20 } from "../typechain-types";

import * as helpers from "../utils/helpers";

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
  let durationSeconds = BigNumber.from("2700"); // 45 mins

  let snapshotId: any;

  before(async function () {
    accounts = await ethers.getSigners();
    
    const minDelay = BigNumber.from("10");
    // let the beneficiaries and several more addresses be proposers
    const proposers = [
      accounts[1].address,
      accounts[2].address,
    ];
    // let the owner and one more address have an executor role
    const executors = [accounts[0].address];
    const adminAccount = accounts[0]; // e.g. the owner of the vesting contract

    const Timelock = await ethers.getContractFactory("Timelock");
    timelock = await Timelock.deploy(
      minDelay,
      proposers,
      executors,
      adminAccount.address,
      {gasLimit: 15_000_000}
    );
    await timelock.deployed();
    
  });

  beforeEach(async function () {
    //snapshotId = await ethers.provider.send('evm_snapshot', []);
    accounts = await ethers.getSigners();

    beneficiariesArray = [
      accounts[1].address,
      accounts[2].address,
      accounts[3].address,
    ]; // let the deployer not be present in the beneficiaries array
    // balances are 1 token, 2 tokens and 3 tokens respectively
    beneficiariesBalances = [
      BigNumber.from("1000000000000000000"),
      BigNumber.from("2000000000000000000"),
      BigNumber.from("3000000000000000000"),
    ];

    const latestBlockTs = await helpers.getLatestBlockTimestamp();
    startTimestamp = BigNumber.from(latestBlockTs).add(BigNumber.from("1800")); // 30 mins from now
    cliff = BigNumber.from("600"); // 10 mins after the start

    freeTokensPercentage = BigNumber.from("10");

    const MockERC20Factory = await ethers.getContractFactory("MockERC20");
    mockERC20 = await MockERC20Factory.deploy({gasLimit: 3_000_000});

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
      durationSeconds,
      {gasLimit: 3_000_000}
    );

    await tokenVesting.deployed();
    const vestingContractAddress = (await tokenVesting.deployTransaction.wait())
      .contractAddress;

    tokensToVest = BigNumber.from("6000000000000000000"); // 6 tokens

    mockERC20.transfer(vestingContractAddress, tokensToVest, {gasLimit: 3_000_000});
  });

//   afterEach(async function () {
//     const ts = await helpers.getLatestBlockTimestamp();

//     await ethers.provider.send('evm_revert', [snapshotId]);

//     await helpers.moveAtTimestamp(ts + 5);
// });

  describe("Vesting Deployment", () => {
    it("should be deployed with proper arguments successfully", async function () {
      expect(await tokenVesting.vestedTokensOf(accounts[1].address)).to.eq(
        BigNumber.from("1000000000000000000")
      );
      expect(await tokenVesting.vestedTokensOf(accounts[2].address)).to.eq(
        BigNumber.from("2000000000000000000")
      );
      expect(await tokenVesting.vestedTokensOf(accounts[3].address)).to.eq(
        BigNumber.from("3000000000000000000")
      );

      expect(await tokenVesting.start()).to.equal(startTimestamp);

      expect(await tokenVesting.token()).to.eq(mockERC20.address);
      expect(await tokenVesting.timelock()).to.equal(timelock.address);

      expect(await tokenVesting.duration()).to.equal(durationSeconds);
      expect(await tokenVesting.freeTokensPercentage()).to.equal(
        freeTokensPercentage
      );
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

    it("do the optimisticAssociation properly", async function () {
      await expect(tokenVesting.optimisticAssociation(mockERC20.address)).to.not.be.reverted;
    });

    it("should not be able to claim more than initialUnlock amount before start timestamp", async function () {
      await helpers.moveAtTimestamp(startTimestamp.toNumber() + 100);
      await tokenVesting.connect(accounts[1]).claim();
      let releasedAmount = await tokenVesting.claimedOf(accounts[1].address);

      const acc1ScheduledTokens = await tokenVesting.vestedTokensOf(
        accounts[1].address
      );

      await expect(releasedAmount).eq(
        BigNumber.from(
          acc1ScheduledTokens.mul(freeTokensPercentage).div(BigNumber.from(100))
        )
      );

      const latestTs = await helpers.getLatestBlockTimestamp();

      await helpers.moveAtTimestamp(latestTs + 100);

      await tokenVesting.connect(accounts[1]).claim();
      releasedAmount = await tokenVesting.claimedOf(accounts[1].address);
      await expect(releasedAmount).eq(
        BigNumber.from(
          acc1ScheduledTokens.mul(freeTokensPercentage).div(BigNumber.from(100))
        )
      );
    });

    it("should not be able to claim unlocked tokens before cliff has expired", async function () {
      await tokenVesting.connect(accounts[2]).claim(); // claim initial unlocked tokens
      await helpers.moveAtTimestamp(
        startTimestamp.toNumber() + cliff.toNumber() - 10
      ); // slightly before the cliff expires
      await tokenVesting.connect(accounts[2]).claim();

      const releasedAmount = await tokenVesting.claimedOf(accounts[2].address);

      const acc2ScheduledTokens = await tokenVesting.vestedTokensOf(
        accounts[2].address
      );

      await expect(releasedAmount).eq(
        BigNumber.from(
          acc2ScheduledTokens.mul(freeTokensPercentage).div(BigNumber.from(100))
        )
      );
    });

    it("beneficiary should be able to claim any unlocked tokens after cliff has expired", async function () {
      await tokenVesting.connect(accounts[1]).claim(); // claim initial unlocked tokens

      await helpers.moveAtTimestamp(
        startTimestamp.toNumber() + cliff.toNumber() + 10
      );

      await expect(tokenVesting.connect(accounts[1]).claim()).to.emit(
        tokenVesting,
        "TokensClaimed"
      );
      const totalReleasedAmount = await tokenVesting.claimedOf(
        accounts[1].address
      );

      const acc1ScheduledTokens = await tokenVesting.vestedTokensOf(
        accounts[1].address
      );

      // check that the total amount of released tokens is greater than the amount of free tokens
      await expect(totalReleasedAmount).greaterThan(
        BigNumber.from(
          acc1ScheduledTokens.mul(freeTokensPercentage).div(BigNumber.from(100))
        )
      );
    });

    it("beneficiary should be able to claim all of the scheduled tokens after the whole duration has expired", async function () {
      let vestingBalance = await mockERC20.balanceOf(tokenVesting.address);
      let beneficiary1Balance = await mockERC20.balanceOf(accounts[1].address);

      expect(vestingBalance).eq(tokensToVest);
      expect(beneficiary1Balance).eq(0);

      const ben1ScheduledTokens = await tokenVesting.vestedTokensOf(
        accounts[1].address
      );

      const freeTokensCount = BigNumber.from(
        ben1ScheduledTokens.mul(freeTokensPercentage).div(BigNumber.from(100))
      );
      const remainingTokens = ben1ScheduledTokens.sub(freeTokensCount);

      await expect(tokenVesting.connect(accounts[1]).claim())
        .to.emit(tokenVesting, "TokensClaimed")
        .withArgs(accounts[1].address, freeTokensCount);

      await helpers.moveAtTimestamp(
        startTimestamp.toNumber() + durationSeconds.toNumber() + 1
      );

      await expect(tokenVesting.connect(accounts[1]).claim())
        .to.emit(tokenVesting, "TokensClaimed")
        .withArgs(accounts[1].address, remainingTokens);

      const releasedAmount = await tokenVesting.claimedOf(accounts[1].address);

      await expect(releasedAmount).eq(ben1ScheduledTokens);

      beneficiary1Balance = await mockERC20.balanceOf(accounts[1].address);
      expect(beneficiary1Balance).eq(ben1ScheduledTokens);
    });

    it("updateDuration should revert if not called by the timelock", async function () {
      const currentDuration = await tokenVesting.duration();
      await expect(currentDuration).eq(durationSeconds);

      await expect(
        tokenVesting.updateDuration(BigNumber.from("200"))
      ).to.be.revertedWithCustomError(
        tokenVesting,
        "TokenVesting__OnlyCallableByTimelock"
      );
    });

    it("failSafe should revert if not called by the timelock", async function () {
      await expect(tokenVesting.failSafe()).to.be.revertedWithCustomError(
        tokenVesting,
        "TokenVesting__OnlyCallableByTimelock"
      );
    });

    it("timelock should fail changing the duration if the delay hasn't passed", async function () {
      let ABI = ["function updateDuration(uint64 duration)"]; // try only with uint if fails
      let iface = new ethers.utils.Interface(ABI);
      const data = iface.encodeFunctionData("updateDuration", [
        BigNumber.from("200"),
      ]);

      const zeroBytes32 = ethers.constants.HashZero;
      const salt = ethers.utils.formatBytes32String("1");
      const delay = BigNumber.from("30");

      // connect with the beneficiary and make the proposal
      await timelock
        .connect(accounts[1])
        .schedule(
          tokenVesting.address,
          BigNumber.from("0"),
          data,
          zeroBytes32,
          salt,
          delay
        );

      const latestTs = await helpers.getLatestBlockTimestamp();

      await helpers.moveAtTimestamp(latestTs + 5);

      const currentDuration = await tokenVesting.duration();
      await expect(currentDuration).eq(durationSeconds);

      await expect(
        timelock.execute(
          tokenVesting.address,
          BigNumber.from("0"),
          data,
          zeroBytes32,
          salt
        )
      ).to.be.revertedWith("TimelockController: operation is not ready");
    });

    it("timelock should fail executing updateDuration if the user does not have an executor role", async function () {
      let ABI = ["function updateDuration(uint64 duration)"]; // try only with uint if fails
      let iface = new ethers.utils.Interface(ABI);
      const data = iface.encodeFunctionData("updateDuration", [
        BigNumber.from("200"),
      ]);

      const zeroBytes32 = ethers.constants.HashZero;
      const salt = ethers.utils.formatBytes32String("1"); // try with bytes32 if fails
      const delay = BigNumber.from("30"); // this adds up to the block.timestamp

      // connect with the beneficiary and make the proposal
      await timelock
        .connect(accounts[1])
        .schedule(
          tokenVesting.address,
          BigNumber.from("0"),
          data,
          zeroBytes32,
          salt,
          delay
        );

      const latestTs = await helpers.getLatestBlockTimestamp();

      await helpers.moveAtTimestamp(latestTs + 50);

      const currentDuration = await tokenVesting.duration();
      await expect(currentDuration).eq(durationSeconds);

      await expect(
        timelock
          .connect(accounts[1])
          .execute(
            tokenVesting.address,
            BigNumber.from("0"),
            data,
            zeroBytes32,
            salt
          )
      ).to.be.reverted;
    });

    it("timelock should successfully change duration", async function () {
      let ABI = ["function updateDuration(uint64 duration)"];
      let iface = new ethers.utils.Interface(ABI);
      const data = iface.encodeFunctionData("updateDuration", [
        BigNumber.from("200"),
      ]);

      const zeroBytes32 = ethers.constants.HashZero;
      const salt = ethers.utils.formatBytes32String("1");
      const delay = BigNumber.from("30"); // this adds up to the block.timestamp

      // connect with the beneficiary and make the proposal
      await timelock
        .connect(accounts[1])
        .schedule(
          tokenVesting.address,
          BigNumber.from("0"),
          data,
          zeroBytes32,
          salt,
          delay
        );

      const latestTs = await helpers.getLatestBlockTimestamp();

      await helpers.moveAtTimestamp(latestTs + 50);

      const currentDuration = await tokenVesting.duration();
      await expect(currentDuration).eq(durationSeconds);

      expect(await timelock.execute(
        tokenVesting.address,
        BigNumber.from("0"),
        data,
        zeroBytes32,
        salt
      )).to.be.emit(tokenVesting, 'DurationUpdated').withArgs(BigNumber.from("200"));

      const newDuration = await tokenVesting.duration();

      await expect(newDuration).eq(BigNumber.from("200"));
    });

    it("timelock should successfully operate a failSafe", async function () {
      let ABI = ["function failSafe()"];
      let iface = new ethers.utils.Interface(ABI);
      const data = iface.encodeFunctionData("failSafe");

      const zeroBytes32 = ethers.constants.HashZero;
      const salt = ethers.utils.formatBytes32String("2");
      const delay = BigNumber.from("30"); // this adds up to the block.timestamp

      // connect with the beneficiary and make the proposal
      await timelock
        .connect(accounts[1])
        .schedule(
          tokenVesting.address,
          BigNumber.from("0"),
          data,
          zeroBytes32,
          salt,
          delay
        );

      const latestTs = await helpers.getLatestBlockTimestamp();

      await helpers.moveAtTimestamp(latestTs + 35);

      const currentVestingContractAmount = await mockERC20.balanceOf(
        tokenVesting.address
      );

      await expect(currentVestingContractAmount).eq(tokensToVest);

      const ownerBalanceBefore = await mockERC20.balanceOf(accounts[0].address);

      await timelock.execute(
        tokenVesting.address,
        BigNumber.from("0"),
        data,
        zeroBytes32,
        salt
      );

      const newAmount = await mockERC20.balanceOf(tokenVesting.address);

      await expect(newAmount).eq(BigNumber.from("0"));

      const ownerBalanceAfter = await mockERC20.balanceOf(accounts[0].address);

      // ensure tokens are transferred backed to the owner after a fail safe
      expect(ownerBalanceAfter).eq(ownerBalanceBefore.add(tokensToVest));
    });

    it("timelock should be able to change token address", async function () {
      await expect(
        tokenVesting.changeTokenAddress(accounts[2].address)
      ).to.be.revertedWithCustomError(tokenVesting, 'TokenVesting__OnlyCallableByTimelock');

      let ABI = ["function changeTokenAddress(address _newTokenAddress)"];
      let iface = new ethers.utils.Interface(ABI);
      const data = iface.encodeFunctionData("changeTokenAddress", [accounts[4].address]);

      const zeroBytes32 = ethers.constants.HashZero;
      const salt = ethers.utils.formatBytes32String("1");
      const delay = BigNumber.from("30"); // this adds up to the block.timestamp

      // connect with the beneficiary and make the proposal
      await timelock
        .connect(accounts[1])
        .schedule(
          tokenVesting.address,
          BigNumber.from("0"),
          data,
          zeroBytes32,
          salt,
          delay
        );

      const latestTs = await helpers.getLatestBlockTimestamp();

      await helpers.moveAtTimestamp(latestTs + 50);

      const currentTokenAddress = await tokenVesting.token();

      await expect(currentTokenAddress).eq(mockERC20.address);

      expect(await timelock.execute(
        tokenVesting.address,
        BigNumber.from("0"),
        data,
        zeroBytes32,
        salt
      )).to.be.emit(tokenVesting, 'TokenAddressChanged').withArgs(accounts[4].address);

      const newTokenAddress = await tokenVesting.token();

      await expect(newTokenAddress).eq(accounts[4].address);
    });

    it("owner should be able to change timelock address", async function () {
      await expect(tokenVesting.connect(accounts[1]).changeTimelockAddress(accounts[15].address)).to.be.revertedWith("Ownable: caller is not the owner");

      await expect(
        tokenVesting.changeTimelockAddress(ethers.constants.AddressZero)
      ).to.be.revertedWithCustomError(tokenVesting, 'TokenVesting__TimelockAddressIsZero');

      const currentTimelockAddr = await tokenVesting.timelock();

      expect(currentTimelockAddr).eq(timelock.address);
      
      await expect(
        tokenVesting.changeTimelockAddress(accounts[15].address)
      ).to.be.emit(tokenVesting, 'TimelockAddressChanged').withArgs(accounts[15].address);

      const afterChangeTimelockAddr = await tokenVesting.timelock();

      expect(afterChangeTimelockAddr).eq(accounts[15].address);

    });

    it("owner should be able to add more tokens for distribution", async function () {
      let vestingBalance = await mockERC20.balanceOf(tokenVesting.address);
      expect(vestingBalance).eq(tokensToVest);

      const tokensToAdd = BigNumber.from("1000000000000000000"); // 1 more token to add

      const ben2ScheduledTokensBefore = await tokenVesting.vestedTokensOf(
        accounts[2].address
      );

      const beneficiaries = [];
      const balances = [];

      const beneficiariesToAdd = 5;

      // Note: We've hit a TRANSACTION_OVERSIZE limit when testing on Hedera testnet which appears to be 6kB.
      // Thus, this only allows ~ 90 beneficiariesToAdd per transaction.
      for (let i = 0; i < beneficiariesToAdd; i++) {
        beneficiaries.push(accounts[i].address);
        balances.push(tokensToAdd);
      }

      await expect(
        tokenVesting.connect(accounts[4]).addTokens(beneficiaries, balances)
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await mockERC20.increaseAllowance(
        tokenVesting.address,
        tokensToAdd.mul(beneficiariesToAdd)
      );

      await expect(tokenVesting.addTokens(beneficiaries, balances)).to.not.be
        .reverted;

      const ben2ScheduledTokensAfter = await tokenVesting.vestedTokensOf(
        accounts[2].address
      );
      expect(ben2ScheduledTokensAfter).eq(
        ben2ScheduledTokensBefore.add(tokensToAdd)
      );
    });

    it("only owner should be able to change timelock address", async function () {
      const currentTimelockAddr = await tokenVesting.timelock();
      await expect(currentTimelockAddr).eq(timelock.address);

      await expect(
        tokenVesting
          .connect(accounts[1])
          .changeTimelockAddress(accounts[15].address)
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await expect(tokenVesting.changeTimelockAddress(accounts[15].address))
        .to.be.emit(tokenVesting, "TimelockAddressChanged")
        .withArgs(accounts[15].address);

      const changedTimelockAddr = await tokenVesting.timelock();
      await expect(changedTimelockAddr).eq(accounts[15].address);
    });
  });
});
