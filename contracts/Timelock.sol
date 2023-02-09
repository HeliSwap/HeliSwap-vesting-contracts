// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./libs/Errors.sol";
import "./interfaces/ITimelock.sol";

import "hardhat/console.sol";

contract Timelock is Ownable, ITimelock {
    uint256 public override lockTime;
    mapping(bytes4 => Lock) public override locks;

    modifier scheduleExpired(bytes4 fn) {
        if (locks[fn].schedule == 0) {
            revert Errors.Timelock__ScheduleHasNotBeenSet();
        }
        if (locks[fn].schedule >= block.timestamp) {
            revert Errors.Timelock__ScheduleNotExpiredYet(locks[fn].schedule);
        }
        _;
        locks[fn].schedule = 0;
    }

    constructor(uint256 defaultTimeLock) {
        lockTime = defaultTimeLock;
    }

    function schedule(bytes4 fn, bytes calldata params) external onlyOwner {
        if (locks[fn].schedule >= block.timestamp) {
            revert Errors.Timelock__AlreadySheduledTo(locks[fn].schedule);
        }

        locks[fn] = Lock(block.timestamp + lockTime, params);

        emit LockSheduled(fn, block.timestamp + lockTime);
    }
}
