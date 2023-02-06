import { ethers } from "hardhat";
import { expect } from "chai";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ClaimDrop, MockERC20 } from "../typechain";
import { abi as ClaimDropABI } from "../artifacts/contracts/ClaimDrop.sol/ClaimDrop.json";

import { smock } from "@defi-wonderland/smock";

let signers: SignerWithAddress[];
let claimDrop: ClaimDrop;
let mockERC20: MockERC20;

describe("ClaimDrop", function () {

  const calcExpectedClaimable = async function (amount: any, freeVestedAmount: any, extraAmount: any) {
    const end = await claimDrop.end();
    const cliffEnd = await claimDrop.cliffEnd();

    const timestamp = (await ethers.provider.getBlock("latest")).timestamp;
    let ratio = ethers.BigNumber.from(timestamp.toString()).sub(cliffEnd).mul(ethers.utils.parseEther("1")).div(
      end.sub(cliffEnd)
    );

    if (end.lt(timestamp)) {
      ratio = ethers.utils.parseEther("1");
    }
    return {
      allocated: ratio.mul(amount).div(ethers.utils.parseEther("1")).add(freeVestedAmount),
      extra: ratio.mul(extraAmount).div(ethers.utils.parseEther("1"))
    };
  }

  beforeEach(async function () {
    signers = await ethers.getSigners();

    const MockERC20Factory = await ethers.getContractFactory("MockERC20");
    mockERC20 = await (await MockERC20Factory.deploy()).deployed();

    const optimisticContract = await smock.fake([
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "associatee",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "token",
            "type": "address"
          }
        ],
        "name": "associateToken",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
      {
        address: "0x0000000000000000000000000000000000000167",
      });

    // // @ts-ignore
    optimisticContract.associateToken.returns(167);

    const ClaimDropFactory = await ethers.getContractFactory("ClaimDrop");
    claimDrop = await (await ClaimDropFactory.deploy(
      mockERC20.address,
      0,
      60 * 60 * 24 // 1 day
    )).deployed();
  });

  it("Should add beneficiaries", async function () {
    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("2"));
    await claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1")
    ]);

    expect(await claimDrop.vestedTokensOf(signers[1].address)).to.be.equal(ethers.utils.parseEther("1"));
    expect(await claimDrop.vestedTokensOf(signers[2].address)).to.be.equal(ethers.utils.parseEther("1"));

    expect(await claimDrop.totalAllocated()).to.be.equal(ethers.utils.parseEther("2"));
    expect(await mockERC20.balanceOf(claimDrop.address)).to.be.equal(ethers.utils.parseEther("2"));
  });

  it("Should revert in case vesting has already started", async function () {
    await claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60);
    await expect(claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1")
    ])).to.be.revertedWith("ClaimDrop__CanNotAddMoreBeneficiaries");
  });

  it("Should revert in case beneficiaries are more than the balances being provided", async function () {
    await expect(claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1")
    ])).to.be.revertedWith("ClaimDrop__TooMuchBeneficiariesOrBalances");
  });

  it("Should revert in case of non-owner tries to add beneficiaries", async function () {
    await expect(claimDrop.connect(signers[1]).addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1")
    ])).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should start vesting", async function () {
    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("2"));
    await claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1")
    ])

    await claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60);
    const timestamp = (await ethers.provider.getBlock("latest")).timestamp;

    expect(await claimDrop.start()).to.be.equal(timestamp);
    expect(await claimDrop.end()).to.be.equal(timestamp + 24 * 60 * 60);
    expect(await claimDrop.cliffEnd()).to.be.equal(timestamp + 60 * 60);
    expect(await claimDrop.claimExtraTime()).to.be.equal(24 * 60 * 60);
  });

  it("Should revert in case vesting has already started", async function () {
    await claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60);
    await expect(claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60)).to.be.revertedWith("ClaimDrop__CanNotReStart");
  });

  it("Should revert in case cliff duration is bigger than vesting duration", async function () {
    await expect(claimDrop.startVesting(60 * 60, 24 * 60 * 60, 24 * 60 * 60)).to.be.revertedWith("ClaimDrop__InvalidCliffDuration");
  });

  it("Should revert in case of non-owner tries to start vesting", async function () {
    await expect(claimDrop.connect(signers[1]).startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60)).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should update vesting duration", async function () {
    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("2"));
    await claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1")
    ])

    await claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60);
    const abiInterface = new ethers.utils.Interface(ClaimDropABI);
    await claimDrop.schedule(
      abiInterface.getSighash("updateDuration"),
      ethers.utils.defaultAbiCoder.encode(["uint256"], [48 * 60 * 60])
    )

    const timestamp = (await ethers.provider.getBlock("latest")).timestamp;
    const schedule = await claimDrop.locks(abiInterface.getSighash("updateDuration"));
    expect(schedule[0]).to.be.equal((await claimDrop.lockTime()).add(timestamp));
    expect(schedule[1]).to.be.equal(ethers.utils.defaultAbiCoder.encode(["uint256"], [48 * 60 * 60]));

    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24]);
    await ethers.provider.send("evm_mine", []);

    await claimDrop.updateDuration();
    expect(await claimDrop.end()).to.be.equal((await claimDrop.start()).add(48 * 60 * 60));
  });

  it("Should revert in case the new vesting duration is less than the cliff period", async function () {
    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("2"));
    await claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1")
    ])
    await claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60);

    const abiInterface = new ethers.utils.Interface(ClaimDropABI);
    await claimDrop.schedule(
      abiInterface.getSighash("updateDuration"),
      ethers.utils.defaultAbiCoder.encode(["uint256"], [60])
    )
    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24]);
    await ethers.provider.send("evm_mine", []);

    await expect(claimDrop.updateDuration()).to.be.revertedWith("ClaimDrop__InvalidVestingDuration");
  });

  it("Should revert in case the update has not been scheduled beforehand", async function () {
    await expect(claimDrop.updateDuration()).to.be.revertedWith(`Timelock__ScheduleHasNotBeenSet`);
  });

  it("Should revert in case the update has been already scheduled", async function () {
    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("2"));
    await claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1")
    ])

    await claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60);
    const abiInterface = new ethers.utils.Interface(ClaimDropABI);
    await claimDrop.schedule(
      abiInterface.getSighash("updateDuration"),
      ethers.utils.defaultAbiCoder.encode(["uint256"], [48 * 60 * 60])
    )

    const timestamp = (await ethers.provider.getBlock("latest")).timestamp;
    await expect(claimDrop.updateDuration()).to.be.revertedWith(`Timelock__ScheduleNotExpiredYet(${(await claimDrop.lockTime()).add(timestamp)})`);

    await expect(claimDrop.schedule(
      abiInterface.getSighash("updateDuration"),
      ethers.utils.defaultAbiCoder.encode(["uint256"], [48 * 60 * 60])
    )).to.be.revertedWith(`Timelock__AlreadySheduledTo(${(await claimDrop.lockTime()).add(timestamp)})`);
  });

  it("Should claim", async function () {
    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("2"));
    await claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1")
    ])

    await claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60);

    await ethers.provider.send("evm_increaseTime", [60 * 60]);
    await ethers.provider.send("evm_mine", []);

    await claimDrop.connect(signers[1]).claim();
    let expectedClaim1 = await calcExpectedClaimable(
      ethers.utils.parseEther("1"),
      0,
      0
    );

    expect(await mockERC20.balanceOf(signers[1].address)).to.be.equal(
      expectedClaim1.allocated
    );
    expect(await claimDrop.claimedOf(signers[1].address)).to.be.equal(
      expectedClaim1.allocated
    );

    await ethers.provider.send("evm_increaseTime", [41398]);
    await ethers.provider.send("evm_mine", []);

    await claimDrop.connect(signers[1]).claim();
    expectedClaim1 = await calcExpectedClaimable(
      ethers.utils.parseEther("1"),
      0,
      0
    );
    await claimDrop.connect(signers[2]).claim();
    let expectedClaim2 = await calcExpectedClaimable(
      ethers.utils.parseEther("1"),
      0,
      0
    );

    expect(await mockERC20.balanceOf(signers[1].address)).to.be.equal(expectedClaim1.allocated);
    expect(await mockERC20.balanceOf(signers[2].address)).to.be.equal(expectedClaim2.allocated);
    expect(await claimDrop.claimedOf(signers[1].address)).to.be.equal(expectedClaim1.allocated);
    expect(await claimDrop.claimedOf(signers[2].address)).to.be.equal(expectedClaim2.allocated);
  });

  it("Should claim with extra tokens", async function () {
    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("2"));
    await claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1.234"),
      ethers.utils.parseEther("0.766")
    ])

    await claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60);

    await ethers.provider.send("evm_increaseTime", [60 * 60]);
    await ethers.provider.send("evm_mine", []);

    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("3"));
    await claimDrop.fund(ethers.utils.parseEther("3"));

    await claimDrop.connect(signers[1]).claim();
    let expectedClaim1 = await calcExpectedClaimable(
      ethers.utils.parseEther("1.234"),
      0,
      ethers.utils.parseEther("1.851")
    );

    expect(await mockERC20.balanceOf(signers[1].address)).to.be.equal(
      expectedClaim1.allocated.add(expectedClaim1.extra)
    );
    expect(await claimDrop.claimedOf(signers[1].address)).to.be.equal(
      expectedClaim1.allocated.add(expectedClaim1.extra)
    );

    expect(await claimDrop.totalAllocatedOf(signers[1].address)).to.be.gte("3084999999999999990");
    expect(await claimDrop.totalAllocatedOf(signers[1].address)).to.be.lte("3085000000000000000");
    expect(await claimDrop.totalAllocatedOf(signers[2].address)).to.be.gte("1914999999999999990");
    expect(await claimDrop.totalAllocatedOf(signers[2].address)).to.be.lte("1915000000000000000");

    await ethers.provider.send("evm_increaseTime", [41397]);
    await ethers.provider.send("evm_mine", []);

    await claimDrop.connect(signers[1]).claim();
    expectedClaim1 = await calcExpectedClaimable(
      ethers.utils.parseEther("1.234"),
      0,
      ethers.utils.parseEther("1.851")
    );

    await claimDrop.connect(signers[2]).claim();
    let expectedClaim2 = await calcExpectedClaimable(
      ethers.utils.parseEther("0.766"),
      0,
      ethers.utils.parseEther("1.149")
    );

    expect(await mockERC20.balanceOf(signers[1].address)).to.be.equal(
      expectedClaim1.allocated.add(expectedClaim1.extra).add(1) // 1 wei tolerance is acceptable
    );
    expect(await mockERC20.balanceOf(signers[2].address)).to.be.equal(
      expectedClaim2.allocated.add(expectedClaim2.extra)
    );
    expect(await claimDrop.claimedOf(signers[1].address)).to.be.equal(
      expectedClaim1.allocated.add(expectedClaim1.extra).add(1)
    );
    expect(await claimDrop.claimedOf(signers[2].address)).to.be.equal(
      expectedClaim2.allocated.add(expectedClaim2.extra)
    );

    await ethers.provider.send("evm_increaseTime", [50000]);
    await ethers.provider.send("evm_mine", []);

    await claimDrop.connect(signers[1]).claim();
    expectedClaim1 = await calcExpectedClaimable(
      ethers.utils.parseEther("1.234"),
      0,
      ethers.utils.parseEther("1.851")
    );

    await claimDrop.connect(signers[2]).claim();
    expectedClaim2 = await calcExpectedClaimable(
      ethers.utils.parseEther("0.766"),
      0,
      ethers.utils.parseEther("1.149")
    );

    expect(await mockERC20.balanceOf(signers[1].address)).to.be.equal(
      expectedClaim1.allocated.add(expectedClaim1.extra)
    );
    expect(await mockERC20.balanceOf(signers[2].address)).to.be.equal(
      expectedClaim2.allocated.add(expectedClaim2.extra)
    );
    expect(await claimDrop.claimedOf(signers[1].address)).to.be.equal(
      expectedClaim1.allocated.add(expectedClaim1.extra)
    );
    expect(await claimDrop.claimedOf(signers[2].address)).to.be.equal(
      expectedClaim2.allocated.add(expectedClaim2.extra)
    );
    expect(expectedClaim1.extra).to.be.equal(await claimDrop.extraTokensOf(signers[1].address));
    expect(expectedClaim2.extra).to.be.equal(await claimDrop.extraTokensOf(signers[2].address));

    expect(await mockERC20.balanceOf(claimDrop.address)).to.be.gte(0);
    expect(await mockERC20.balanceOf(claimDrop.address)).to.be.lte(10);
    expect(expectedClaim1.allocated).to.be.gte("1233999999999999990");
    expect(expectedClaim1.allocated).to.be.lte(ethers.utils.parseEther("1.234"));
    expect(expectedClaim1.extra).to.be.gte("1850999999999999990");
    expect(expectedClaim1.extra).to.be.lte(ethers.utils.parseEther("1.851"));

  });

  it("Should claim immediately not vested tokens", async function () {
    const ClaimDropFactory = await ethers.getContractFactory("ClaimDrop");
    claimDrop = await (await ClaimDropFactory.deploy(
      mockERC20.address,
      ethers.utils.parseEther("0.05"),
      60 * 60 * 24 // 1 day
    )).deployed();

    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("2"));
    await claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1")
    ])

    await claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60);

    await ethers.provider.send("evm_increaseTime", [60 * 60]);
    await ethers.provider.send("evm_mine", []);

    await claimDrop.connect(signers[1]).claim();
    let expectedClaim1 = await calcExpectedClaimable(
      ethers.utils.parseEther("0.95"),
      ethers.utils.parseEther("0.05"),
      0
    );

    expect(await mockERC20.balanceOf(signers[1].address)).to.be.equal(
      expectedClaim1.allocated
    );
    expect(await claimDrop.claimedOf(signers[1].address)).to.be.equal(
      expectedClaim1.allocated
    );

    await ethers.provider.send("evm_increaseTime", [41400]);
    await ethers.provider.send("evm_mine", []);

    await claimDrop.connect(signers[1]).claim();
    expectedClaim1 = await calcExpectedClaimable(
      ethers.utils.parseEther("0.95"),
      ethers.utils.parseEther("0.05"),
      0
    );
    await claimDrop.connect(signers[2]).claim();
    let expectedClaim2 = await calcExpectedClaimable(
      ethers.utils.parseEther("0.95"),
      ethers.utils.parseEther("0.05"),
      0
    );

    expect(await mockERC20.balanceOf(signers[1].address)).to.be.equal(
      expectedClaim1.allocated
    );
    expect(await mockERC20.balanceOf(signers[2].address)).to.be.equal(
      expectedClaim2.allocated
    );
    expect(await claimDrop.claimedOf(signers[1].address)).to.be.equal(
      expectedClaim1.allocated
    );
    expect(await claimDrop.claimedOf(signers[2].address)).to.be.equal(
      expectedClaim2.allocated
    );

    await ethers.provider.send("evm_increaseTime", [50000]);
    await ethers.provider.send("evm_mine", []);

    await claimDrop.connect(signers[1]).claim();
    expectedClaim1 = await calcExpectedClaimable(
      ethers.utils.parseEther("0.95"),
      ethers.utils.parseEther("0.05"),
      0
    );
    await claimDrop.connect(signers[2]).claim();
    expectedClaim2 = await calcExpectedClaimable(
      ethers.utils.parseEther("0.95"),
      ethers.utils.parseEther("0.05"),
      0
    );

    expect(await mockERC20.balanceOf(signers[1].address)).to.be.equal(
      expectedClaim1.allocated
    );
    expect(await mockERC20.balanceOf(signers[2].address)).to.be.equal(
      expectedClaim2.allocated
    );
    expect(await claimDrop.claimedOf(signers[1].address)).to.be.equal(
      expectedClaim1.allocated
    );
    expect(await claimDrop.claimedOf(signers[2].address)).to.be.equal(
      expectedClaim2.allocated
    );

    expect(await mockERC20.balanceOf(claimDrop.address)).to.be.gte(0);
    expect(await mockERC20.balanceOf(claimDrop.address)).to.be.lte(10);
    expect(expectedClaim1.allocated).to.be.gte("999999999999999990"); // 0.99..90
    expect(expectedClaim1.allocated).to.be.lte(ethers.utils.parseEther("1"));
  });

  it("Should claim immediately not vested tokens with extra tokens", async function () {
    const ClaimDropFactory = await ethers.getContractFactory("ClaimDrop");
    claimDrop = await (await ClaimDropFactory.deploy(
      mockERC20.address,
      ethers.utils.parseEther("0.05"),
      60 * 60 * 24 // 1 day
    )).deployed();

    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("2"));
    await claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1")
    ])

    await claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60);

    await ethers.provider.send("evm_increaseTime", [60 * 60]);
    await ethers.provider.send("evm_mine", []);

    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("3"));
    await claimDrop.fund(ethers.utils.parseEther("3"));

    await claimDrop.connect(signers[1]).claim();
    let expectedClaim1 = await calcExpectedClaimable(
      ethers.utils.parseEther("0.95"),
      ethers.utils.parseEther("0.05"),
      ethers.utils.parseEther("1.5")
    );

    expect(await mockERC20.balanceOf(signers[1].address)).to.be.equal(
      expectedClaim1.allocated.add(expectedClaim1.extra)
    );
    expect(await claimDrop.claimedOf(signers[1].address)).to.be.equal(
      expectedClaim1.allocated.add(expectedClaim1.extra)
    );

    await ethers.provider.send("evm_increaseTime", [18000]);
    await ethers.provider.send("evm_mine", []);

    await claimDrop.connect(signers[1]).claim();
    expectedClaim1 = await calcExpectedClaimable(
      ethers.utils.parseEther("0.95"),
      ethers.utils.parseEther("0.05"),
      ethers.utils.parseEther("1.5")
    );

    await claimDrop.connect(signers[2]).claim();
    let expectedClaim2 = await calcExpectedClaimable(
      ethers.utils.parseEther("0.95"),
      ethers.utils.parseEther("0.05"),
      ethers.utils.parseEther("1.5")
    );

    expect(await mockERC20.balanceOf(signers[1].address)).to.be.equal(
      expectedClaim1.allocated.add(expectedClaim1.extra)
    );
    expect(await mockERC20.balanceOf(signers[2].address)).to.be.equal(
      expectedClaim2.allocated.add(expectedClaim2.extra)
    );
    expect(await claimDrop.claimedOf(signers[1].address)).to.be.equal(
      expectedClaim1.allocated.add(expectedClaim1.extra)
    );
    expect(await claimDrop.claimedOf(signers[2].address)).to.be.equal(
      expectedClaim2.allocated.add(expectedClaim2.extra)
    );

    await ethers.provider.send("evm_increaseTime", [70000]);
    await ethers.provider.send("evm_mine", []);

    await claimDrop.connect(signers[1]).claim();
    expectedClaim1 = await calcExpectedClaimable(
      ethers.utils.parseEther("0.95"),
      ethers.utils.parseEther("0.05"),
      ethers.utils.parseEther("1.5")
    );
    await claimDrop.connect(signers[2]).claim();
    expectedClaim2 = await calcExpectedClaimable(
      ethers.utils.parseEther("0.95"),
      ethers.utils.parseEther("0.05"),
      ethers.utils.parseEther("1.5")
    );

    expect(await mockERC20.balanceOf(signers[1].address)).to.be.equal(
      expectedClaim1.allocated.add(expectedClaim1.extra)
    );
    expect(await mockERC20.balanceOf(signers[2].address)).to.be.equal(
      expectedClaim2.allocated.add(expectedClaim2.extra)
    );
    expect(await claimDrop.claimedOf(signers[1].address)).to.be.equal(
      expectedClaim1.allocated.add(expectedClaim1.extra)
    );
    expect(await claimDrop.claimedOf(signers[2].address)).to.be.equal(
      expectedClaim2.allocated.add(expectedClaim2.extra)
    );
    expect(expectedClaim1.extra).to.be.equal(await claimDrop.extraTokensOf(signers[1].address));
    expect(expectedClaim2.extra).to.be.equal(await claimDrop.extraTokensOf(signers[2].address));

    expect(await mockERC20.balanceOf(claimDrop.address)).to.be.gte(0);
    expect(await mockERC20.balanceOf(claimDrop.address)).to.be.lte(10);
    expect(expectedClaim1.allocated).to.be.gte("999999999999999990"); // 0.99..90
    expect(expectedClaim1.allocated).to.be.lte(ethers.utils.parseEther("1"));
    expect(expectedClaim1.extra).to.be.gte("1499999999999999990"); // 0.99..90
    expect(expectedClaim1.extra).to.be.lte(ethers.utils.parseEther("1.5"));
  });

  it("Should fund with extra tokens twice", async function () {
    const ClaimDropFactory = await ethers.getContractFactory("ClaimDrop");
    claimDrop = await (await ClaimDropFactory.deploy(
      mockERC20.address,
      ethers.utils.parseEther("0.05"),
      60 * 60 * 24 // 1 day
    )).deployed();

    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("2"));
    await claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1")
    ])

    await claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60);

    await ethers.provider.send("evm_increaseTime", [60 * 60]);
    await ethers.provider.send("evm_mine", []);

    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("3"));
    await claimDrop.fund(ethers.utils.parseEther("3"));

    await claimDrop.connect(signers[1]).claim();
    let expectedClaim1 = await calcExpectedClaimable(
      ethers.utils.parseEther("0.95"),
      ethers.utils.parseEther("0.05"),
      ethers.utils.parseEther("1.5")
    );

    expect(await mockERC20.balanceOf(signers[1].address)).to.be.equal(
      expectedClaim1.allocated.add(expectedClaim1.extra)
    );
    expect(await claimDrop.claimedOf(signers[1].address)).to.be.equal(
      expectedClaim1.allocated.add(expectedClaim1.extra)
    );

    await ethers.provider.send("evm_increaseTime", [18000]);
    await ethers.provider.send("evm_mine", []);

    await claimDrop.connect(signers[1]).claim();
    expectedClaim1 = await calcExpectedClaimable(
      ethers.utils.parseEther("0.95"),
      ethers.utils.parseEther("0.05"),
      ethers.utils.parseEther("1.5")
    );

    await claimDrop.connect(signers[2]).claim();
    let expectedClaim2 = await calcExpectedClaimable(
      ethers.utils.parseEther("0.95"),
      ethers.utils.parseEther("0.05"),
      ethers.utils.parseEther("1.5")
    );

    expect(await mockERC20.balanceOf(signers[1].address)).to.be.equal(
      expectedClaim1.allocated.add(expectedClaim1.extra)
    );
    expect(await mockERC20.balanceOf(signers[2].address)).to.be.equal(
      expectedClaim2.allocated.add(expectedClaim2.extra)
    );
    expect(await claimDrop.claimedOf(signers[1].address)).to.be.equal(
      expectedClaim1.allocated.add(expectedClaim1.extra)
    );
    expect(await claimDrop.claimedOf(signers[2].address)).to.be.equal(
      expectedClaim2.allocated.add(expectedClaim2.extra)
    );

    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("2.131457"));
    await claimDrop.fund(ethers.utils.parseEther("2.131457")); // totally random number

    await ethers.provider.send("evm_increaseTime", [20000]);
    await ethers.provider.send("evm_mine", []);

    await claimDrop.connect(signers[1]).claim();
    expectedClaim1 = await calcExpectedClaimable(
      ethers.utils.parseEther("0.95"),
      ethers.utils.parseEther("0.05"),
      ethers.utils.parseEther("2.5657285")
    );

    await claimDrop.connect(signers[2]).claim();
    expectedClaim2 = await calcExpectedClaimable(
      ethers.utils.parseEther("0.95"),
      ethers.utils.parseEther("0.05"),
      ethers.utils.parseEther("2.5657285")
    );
    expect(await mockERC20.balanceOf(signers[1].address)).to.be.equal(
      expectedClaim1.allocated.add(expectedClaim1.extra).add(1) // 1 wei is acceptable tolerance
    );
    expect(await mockERC20.balanceOf(signers[2].address)).to.be.equal(
      expectedClaim2.allocated.add(expectedClaim2.extra).add(1) // 1 wei is acceptable tolerance
    );
    expect(await claimDrop.claimedOf(signers[1].address)).to.be.equal(
      expectedClaim1.allocated.add(expectedClaim1.extra).add(1) // 1 wei is acceptable tolerance
    );
    expect(await claimDrop.claimedOf(signers[2].address)).to.be.equal(
      expectedClaim2.allocated.add(expectedClaim2.extra).add(1) // 1 wei is acceptable tolerance
    );

    await ethers.provider.send("evm_increaseTime", [50000]);
    await ethers.provider.send("evm_mine", []);

    await claimDrop.connect(signers[1]).claim();
    expectedClaim1 = await calcExpectedClaimable(
      ethers.utils.parseEther("0.95"),
      ethers.utils.parseEther("0.05"),
      ethers.utils.parseEther("2.5657285")
    );
    await claimDrop.connect(signers[2]).claim();
    expectedClaim2 = await calcExpectedClaimable(
      ethers.utils.parseEther("0.95"),
      ethers.utils.parseEther("0.05"),
      ethers.utils.parseEther("2.5657285")
    );

    expect(await mockERC20.balanceOf(signers[1].address)).to.be.equal(
      expectedClaim1.allocated.add(expectedClaim1.extra)
    );
    expect(await mockERC20.balanceOf(signers[2].address)).to.be.equal(
      expectedClaim2.allocated.add(expectedClaim2.extra)
    );
    expect(await claimDrop.claimedOf(signers[1].address)).to.be.equal(
      expectedClaim1.allocated.add(expectedClaim1.extra)
    );
    expect(await claimDrop.claimedOf(signers[2].address)).to.be.equal(
      expectedClaim2.allocated.add(expectedClaim2.extra)
    );
    expect(expectedClaim1.extra).to.be.equal(await claimDrop.extraTokensOf(signers[1].address));
    expect(expectedClaim2.extra).to.be.equal(await claimDrop.extraTokensOf(signers[2].address));

    expect(await mockERC20.balanceOf(claimDrop.address)).to.be.gte(0);
    expect(await mockERC20.balanceOf(claimDrop.address)).to.be.lte(10);
    expect(expectedClaim1.allocated).to.be.gte("999999999999999990");
    expect(expectedClaim1.allocated).to.be.lte(ethers.utils.parseEther("1"));
    expect(expectedClaim1.extra).to.be.gte("2565728499999999990");
    expect(expectedClaim1.extra).to.be.lte(ethers.utils.parseEther("2.5657285"));
  });

  it("Should revert in case of non-beneficiary tries to claim", async function () {
    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("2"));
    await claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1")
    ])

    await claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60);

    await ethers.provider.send("evm_increaseTime", [60 * 60]);
    await ethers.provider.send("evm_mine", []);

    await expect(claimDrop.connect(signers[3]).claim()).to.be.revertedWith("ClaimDrop__OnlyBeneficiary");
  });

  it("Should test claimable", async function () {
    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("2"));
    await claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1.234"),
      ethers.utils.parseEther("0.766")
    ])

    await claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60);
    let claimable = await claimDrop.claimable(signers[1].address);
    expect(claimable).to.be.equal(0);

    claimable = await claimDrop.claimable(signers[3].address);
    expect(claimable).to.be.equal(0);

    await ethers.provider.send("evm_increaseTime", [49 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);

    claimable = await claimDrop.claimable(signers[1].address);
    expect(claimable).to.be.equal(0);
  });

  it("Should divest", async function () {
    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("2"));
    await claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1")
    ])

    await claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60);

    await ethers.provider.send("evm_increaseTime", [49 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);

    const balanceBefore = await mockERC20.balanceOf(signers[0].address);
    await claimDrop.divest();
    expect(balanceBefore.add(ethers.utils.parseEther("2"))).to.be.equal(await mockERC20.balanceOf(signers[0].address));
    expect(await mockERC20.balanceOf(claimDrop.address)).to.be.equal(0);
  });

  it("Should revert in case claim extra period has not expired yet", async function () {
    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("2"));
    await claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1")
    ])

    await claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60);
    await expect(claimDrop.divest()).to.be.revertedWith("ClaimDrop__DivestForbidden");
  });

  it("Should revert in case non-owner tries to divest", async function () {
    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("2"));
    await claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1")
    ])

    await claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60);
    await expect(claimDrop.connect(signers[1]).divest()).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should execute failSafe", async function () {
    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("2"));
    await claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1")
    ])

    await claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60);

    const abiInterface = new ethers.utils.Interface(ClaimDropABI);
    await claimDrop.schedule(
      abiInterface.getSighash("failSafe"),
      "0x"
    )

    const timestamp = (await ethers.provider.getBlock("latest")).timestamp;
    const schedule = await claimDrop.locks(abiInterface.getSighash("failSafe"));
    expect(schedule[0]).to.be.equal((await claimDrop.lockTime()).add(timestamp));
    expect(schedule[1]).to.be.equal("0x");

    await ethers.provider.send("evm_increaseTime", [25 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);

    const balanceBefore = await mockERC20.balanceOf(signers[0].address);
    await claimDrop.failSafe();
    expect(balanceBefore.add(ethers.utils.parseEther("2"))).to.be.equal(await mockERC20.balanceOf(signers[0].address));
    expect(await mockERC20.balanceOf(claimDrop.address)).to.be.equal(0);
    expect(await claimDrop.failMode()).to.be.equal(true);
  });

  it("Should revert in case it has not been scheduled beforehand", async function () {
    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("2"));
    await claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1")
    ])

    await claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60);
    await expect(claimDrop.failSafe()).to.be.revertedWith("Timelock__ScheduleHasNotBeenSet");
  });

  it("Should return 0 claimable after failSafe", async function () {
    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("2"));
    await claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1.234"),
      ethers.utils.parseEther("0.766")
    ])

    await claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60);
    let claimable = await claimDrop.claimable(signers[1].address);
    expect(claimable).to.be.equal(0);

    claimable = await claimDrop.claimable(signers[3].address);
    expect(claimable).to.be.equal(0);

    await ethers.provider.send("evm_increaseTime", [5 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);

    claimable = await claimDrop.claimable(signers[1].address);
    expect(claimable).to.be.gt(0);


    const abiInterface = new ethers.utils.Interface(ClaimDropABI);
    await claimDrop.schedule(
      abiInterface.getSighash("failSafe"),
      "0x"
    )
    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24]);
    await ethers.provider.send("evm_mine", []);

    await claimDrop.failSafe();

    await ethers.provider.send("evm_increaseTime", [5 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);

    claimable = await claimDrop.claimable(signers[1].address);
    expect(claimable).to.be.equal(0);
  });
});
