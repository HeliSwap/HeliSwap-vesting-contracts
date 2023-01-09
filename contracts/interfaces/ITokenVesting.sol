// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ITokenVesting {
    function token() external view returns(IERC20);
    function timelock() external view returns(address);
    function claim() external;
    function addTokens(address beneficiary, uint256 amount) external;
    function failSafe() external;
    function updateDuration(uint64 duration) external;
    function scheduledTokens(address beneficiary) external view returns(uint256);
}