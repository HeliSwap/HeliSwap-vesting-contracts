// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ITokenVesting {
    function token() external view returns(IERC20);
    function timelock() external view returns(address);
    function claim() external;
    function addTokens(address[] memory beneficiaries, uint256[] memory amounts) external;
    function failSafe() external;
    function updateDuration(uint64 duration) external;

    event TokensClaimed(address indexed beneficiary, uint256 amount);
    event TimelockAddressChanged(address newAddress);
    event TokenAddressChanged(address newAddress);
    event FailSafeOccurred();
    event DurationUpdated(uint256 newDuration);
}