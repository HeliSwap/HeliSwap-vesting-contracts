// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ITimelock {
    event LockSheduled(bytes4 fn, uint256 schedule);

    struct Lock {
        uint256 schedule;
        bytes params;
    }

    function lockTime() external view returns (uint256);

    function locks(bytes4) external view returns (uint256, bytes memory);

    function schedule(bytes4 fn, bytes calldata params) external;
}
