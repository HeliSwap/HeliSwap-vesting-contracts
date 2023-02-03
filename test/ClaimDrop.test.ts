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

  it.skip("Should add beneficiaries", async function () {
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

  it.skip("Should revert in case vesting has already started", async function () {
    await claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60);
    await expect(claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1")
    ])).to.be.revertedWith("ClaimDrop__CanNotAddMoreBeneficiaries");
  });

  it.skip("Should revert in case beneficiaries are more than the balances being provided", async function () {
    await expect(claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1")
    ])).to.be.revertedWith("ClaimDrop__TooMuchBeneficiariesOrBalances");
  });

  it.skip("Should revert in case of non-owner tries to add beneficiaries", async function () {
    await expect(claimDrop.connect(signers[1]).addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1")
    ])).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it.skip("Should start vesting", async function () {
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

  it.skip("Should revert in case vesting has already started", async function () {
    await claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60);
    await expect(claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60)).to.be.revertedWith("ClaimDrop__CanNotReStart");
  });

  it.skip("Should revert in case cliff duration is bigger than vesting duration", async function () {
    await expect(claimDrop.startVesting(60 * 60, 24 * 60 * 60, 24 * 60 * 60)).to.be.revertedWith("ClaimDrop__InvalidCliffDuration");
  });

  it.skip("Should revert in case of non-owner tries to start vesting", async function () {
    await expect(claimDrop.connect(signers[1]).startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60)).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it.skip("Should update vesting duration", async function () {
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

  it.skip("Should revert in case the new vesting duration is less than the cliff period", async function () {
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

  it.skip("Should revert in case the update has not been scheduled beforehand", async function () {
    await expect(claimDrop.updateDuration()).to.be.revertedWith(`Timelock__ScheduleHasNotBeenSet`);
  });

  it.skip("Should revert in case the update has been already scheduled", async function () {
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

  it.skip("Should claim", async function () {
    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("2"));
    await claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1")
    ])

    await claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60);

    await ethers.provider.send("evm_increaseTime", [60 * 60]);
    await ethers.provider.send("evm_mine", []);

    await claimDrop.connect(signers[1]).claim();

    expect(await mockERC20.balanceOf(signers[1].address)).to.be.equal("12077294685990");
    expect(await claimDrop.claimedOf(signers[1].address)).to.be.equal("12077294685990");
    expect(await claimDrop.totalAllocated()).to.be.equal(ethers.utils.parseEther("1.999987922705314010"));

    await ethers.provider.send("evm_increaseTime", [41398]);
    await ethers.provider.send("evm_mine", []);

    await claimDrop.connect(signers[1]).claim();
    await claimDrop.connect(signers[2]).claim();

    expect(await mockERC20.balanceOf(signers[1].address)).to.be.equal(ethers.utils.parseEther("0.5"));
    expect(await mockERC20.balanceOf(signers[2].address)).to.be.equal(ethers.utils.parseEther("0.500012077294685990"));
    expect(await claimDrop.claimedOf(signers[1].address)).to.be.equal(ethers.utils.parseEther("0.5"));
    expect(await claimDrop.claimedOf(signers[2].address)).to.be.equal(ethers.utils.parseEther("0.500012077294685990"));

    expect(await claimDrop.totalAllocated()).to.be.equal(ethers.utils.parseEther("0.999987922705314010"));
  });

  it.skip("Should claim with extra tokens", async function () {
    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("2"));
    await claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1.234"),
      ethers.utils.parseEther("0.766")
    ])

    await claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60);

    await ethers.provider.send("evm_increaseTime", [60 * 60]);
    await ethers.provider.send("evm_mine", []);

    await mockERC20.transfer(claimDrop.address, ethers.utils.parseEther("3"));

    await claimDrop.connect(signers[1]).claim();
    expect(await claimDrop.totalAllocatedOf(signers[1].address)).to.be.gte("3084999999999999990");
    expect(await claimDrop.totalAllocatedOf(signers[1].address)).to.be.lte("3085000000000000000");
    expect(await claimDrop.totalAllocatedOf(signers[2].address)).to.be.gte("1914999999999999990");
    expect(await claimDrop.totalAllocatedOf(signers[2].address)).to.be.lte("1915000000000000000");

    expect(await mockERC20.balanceOf(signers[1].address)).to.be.equal("74516908212557");
    expect(await claimDrop.claimedOf(signers[1].address)).to.be.equal("29806763285023");
    expect(await claimDrop.totalAllocated()).to.be.equal("1999970193236714977");

    await ethers.provider.send("evm_increaseTime", [41397]);
    await ethers.provider.send("evm_mine", []);

    await claimDrop.connect(signers[1]).claim();
    await claimDrop.connect(signers[2]).claim();

    expect(await mockERC20.balanceOf(signers[1].address)).to.be.equal("1542499999999999998");
    expect(await mockERC20.balanceOf(signers[2].address)).to.be.equal("957523128019323670");
    expect(await claimDrop.claimedOf(signers[1].address)).to.be.equal("617000000000000000");
    expect(await claimDrop.extraClaimedOf(signers[1].address)).to.be.equal("925499999999999998");
    expect(await claimDrop.claimedOf(signers[2].address)).to.be.equal("383009251207729468");
    expect(await claimDrop.extraClaimedOf(signers[2].address)).to.be.equal("574513876811594202");

    expect(await claimDrop.totalAllocated()).to.be.lte(ethers.utils.parseEther("1"));
    expect(await claimDrop.totalAllocated()).to.be.gte(ethers.utils.parseEther("0.99"));

    await ethers.provider.send("evm_increaseTime", [50000]);
    await ethers.provider.send("evm_mine", []);

    await claimDrop.connect(signers[1]).claim();
    await claimDrop.connect(signers[2]).claim();

    expect(await mockERC20.balanceOf(signers[1].address)).to.be.gte(ethers.utils.parseEther("3.085"));
    expect(await mockERC20.balanceOf(signers[1].address)).to.be.lte(ethers.utils.parseEther("3.0851"));
    expect(await mockERC20.balanceOf(signers[2].address)).to.be.gte(ethers.utils.parseEther("1.9149"));
    expect(await mockERC20.balanceOf(signers[2].address)).to.be.lte(ethers.utils.parseEther("1.915"));
    expect(await claimDrop.claimedOf(signers[1].address)).to.be.equal(ethers.utils.parseEther("1.234"));
    expect(await claimDrop.claimedOf(signers[2].address)).to.be.equal(ethers.utils.parseEther("0.766"));
    expect(await claimDrop.extraClaimedOf(signers[1].address)).to.be.gte(ethers.utils.parseEther("1.8510"));
    expect(await claimDrop.extraClaimedOf(signers[1].address)).to.be.lte(ethers.utils.parseEther("1.8511"));
    expect(await claimDrop.extraClaimedOf(signers[2].address)).to.be.gte(ethers.utils.parseEther("1.1489"));
    expect(await claimDrop.extraClaimedOf(signers[2].address)).to.be.lte(ethers.utils.parseEther("1.1490"));
    expect(await mockERC20.balanceOf(claimDrop.address)).to.be.gte(0);
    expect(await mockERC20.balanceOf(claimDrop.address)).to.be.lte(10);
  });

  it.only("Should claim immediately not vested tokens", async function () {
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
    expect(await mockERC20.balanceOf(signers[1].address)).to.be.equal("50011473429951690");
    expect(await claimDrop.claimedOf(signers[1].address)).to.be.equal("11473429951690");
    expect(await claimDrop.totalAllocated()).to.be.equal("1999988526570048310");

    await ethers.provider.send("evm_increaseTime", [41400]);
    await ethers.provider.send("evm_mine", []);

    await claimDrop.connect(signers[1]).claim();
    console.log("------------")
    console.log(await claimDrop.claimable(signers[2].address));
    await claimDrop.connect(signers[2]).claim();

    expect(await mockERC20.balanceOf(signers[1].address)).to.be.gte(ethers.utils.parseEther("0.0499"));
    expect(await mockERC20.balanceOf(signers[1].address)).to.be.lte(ethers.utils.parseEther("0.0551"));
    expect(await mockERC20.balanceOf(signers[2].address)).to.be.gte(ethers.utils.parseEther("0.0499"));
    expect(await mockERC20.balanceOf(signers[2].address)).to.be.lte(ethers.utils.parseEther("0.0551"));

    expect(await claimDrop.totalAllocated()).to.be.equal(ethers.utils.parseEther("0.9"));

    await ethers.provider.send("evm_increaseTime", [50000]);
    await ethers.provider.send("evm_mine", []);

    await claimDrop.connect(signers[1]).claim();
    await claimDrop.connect(signers[2]).claim();

    expect(await mockERC20.balanceOf(signers[1].address)).to.be.equal(ethers.utils.parseEther("1"));
    expect(await mockERC20.balanceOf(signers[2].address)).to.be.equal(ethers.utils.parseEther("1"));
    expect(await claimDrop.claimedOf(signers[1].address)).to.be.equal(ethers.utils.parseEther("1"));
    expect(await claimDrop.claimedOf(signers[1].address)).to.be.equal(ethers.utils.parseEther("1"));
    expect(await mockERC20.balanceOf(claimDrop.address)).to.be.equal(0);
  });

  it.only("Should claim immediately not vested tokens with extra tokens", async function () {
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

    await mockERC20.transfer(claimDrop.address, ethers.utils.parseEther("3"));

    await claimDrop.connect(signers[1]).claim();
    expect(await mockERC20.balanceOf(signers[1].address)).to.be.equal(ethers.utils.parseEther("0.05068055556"));
    expect(await claimDrop.claimedOf(signers[1].address)).to.be.equal(ethers.utils.parseEther("0.05068055556"));
    expect(await claimDrop.totalAllocated()).to.be.equal(ethers.utils.parseEther("1.9493194444"));

    await ethers.provider.send("evm_increaseTime", [1800]);
    await ethers.provider.send("evm_mine", []);

    await claimDrop.connect(signers[1]).claim();
    await claimDrop.connect(signers[2]).claim();

    expect(await mockERC20.balanceOf(signers[1].address)).to.be.equal(ethers.utils.parseEther("1.3"));
    expect(await mockERC20.balanceOf(signers[2].address)).to.be.equal(ethers.utils.parseEther("1.3"));
    expect(await claimDrop.claimedOf(signers[1].address)).to.be.equal(ethers.utils.parseEther("1.3"));
    expect(await claimDrop.claimedOf(signers[1].address)).to.be.equal(ethers.utils.parseEther("1.3"));

    expect(await claimDrop.totalAllocated()).to.be.equal(ethers.utils.parseEther("0.9"));

    await ethers.provider.send("evm_increaseTime", [1801]);
    await ethers.provider.send("evm_mine", []);

    await claimDrop.connect(signers[1]).claim();
    await claimDrop.connect(signers[2]).claim();

    expect(await mockERC20.balanceOf(signers[1].address)).to.be.equal(ethers.utils.parseEther("2.5"));
    expect(await mockERC20.balanceOf(signers[2].address)).to.be.equal(ethers.utils.parseEther("2.5"));
    expect(await claimDrop.claimedOf(signers[1].address)).to.be.equal(ethers.utils.parseEther("2.5"));
    expect(await claimDrop.claimedOf(signers[1].address)).to.be.equal(ethers.utils.parseEther("2.5"));
    expect(await mockERC20.balanceOf(claimDrop.address)).to.be.equal(0);
  });

  it.skip("Should revert in case of non-beneficiary tries to claim", async function () {
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

  it.skip("Should test claimable", async function () {
    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("2"));
    await claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1.234"),
      ethers.utils.parseEther("0.766")
    ])

    await claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60);
    let claimable = await claimDrop.claimable(signers[1].address);
    expect(claimable[0]).to.be.equal(0);

    claimable = await claimDrop.claimable(signers[3].address);
    expect(claimable[0]).to.be.equal(0);

    await ethers.provider.send("evm_increaseTime", [49 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);

    claimable = await claimDrop.claimable(signers[1].address);
    expect(claimable[0]).to.be.equal(0);
  });

  it.skip("Should divest", async function () {
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

  it.skip("Should revert in case claim extra period has not expired yet", async function () {
    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("2"));
    await claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1")
    ])

    await claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60);
    await expect(claimDrop.divest()).to.be.revertedWith("ClaimDrop__DivestForbidden");
  });

  it.skip("Should revert in case non-owner tries to divest", async function () {
    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("2"));
    await claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1")
    ])

    await claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60);
    await expect(claimDrop.connect(signers[1]).divest()).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it.skip("Should execute failSafe", async function () {
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
  });

  it.skip("Should revert in case it has not been scheduled beforehand", async function () {
    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("2"));
    await claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1")
    ])

    await claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60);

    const timestamp = (await ethers.provider.getBlock("latest")).timestamp;
    await expect(claimDrop.failSafe()).to.be.revertedWith("Timelock__ScheduleHasNotBeenSet");
  });

  it.skip("Should return 0 claimable after failSafe", async function () {
    await mockERC20.approve(claimDrop.address, ethers.utils.parseEther("2"));
    await claimDrop.addBeneficiaries([signers[1].address, signers[2].address], [
      ethers.utils.parseEther("1.234"),
      ethers.utils.parseEther("0.766")
    ])

    await claimDrop.startVesting(24 * 60 * 60, 60 * 60, 24 * 60 * 60);
    let claimable = await claimDrop.claimable(signers[1].address);
    expect(claimable[0]).to.be.equal(0);

    claimable = await claimDrop.claimable(signers[3].address);
    expect(claimable[0]).to.be.equal(0);

    await ethers.provider.send("evm_increaseTime", [5 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);

    claimable = await claimDrop.claimable(signers[1].address);
    expect(claimable[0]).to.be.gt(0);


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
    expect(claimable[0]).to.be.equal(0);
  });
});
