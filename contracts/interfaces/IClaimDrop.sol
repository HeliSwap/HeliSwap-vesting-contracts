// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IClaimDrop {
    event NotVestedPercentage(uint256 notVestedPercentage);
    event BeneficiariesAdded(address[] beneficiaries, uint256[] balances);
    event VestingStarted(
        uint256 start,
        uint256 end,
        uint256 cliffEnd,
        uint256 claimExtraDuration
    );
    event DurationUpdated(uint256 vestingDuration, uint256 end);

    event TokensClaimed(address claimer, uint256 amountClaimed);

    event Divest(uint256 amount);

    event FailSafeOccurred(uint256 safeAmount);

    event Funded(uint256 amount, uint256 index, uint256 totalAllocated);

    function start() external view returns (uint256);

    function end() external view returns (uint256);

    function cliffEnd() external view returns (uint256);

    function claimExtraTime() external view returns (uint256);

    function tokensNotVestedPercentage() external view returns (uint256);

    function token() external view returns (IERC20);

    function failMode() external view returns (bool);

    function index() external view returns (uint256);

    function totalAllocated() external view returns (uint256);

    function claimedOf(address) external view returns (uint256);

    function vestedTokensOf(address) external view returns (uint256);

    function addBeneficiaries(
        address[] memory beneficiaries,
        uint256[] memory balances
    ) external;

    function startVesting(
        uint256 vestingDuration,
        uint256 cliffduration,
        uint256 claimExtraDuration
    ) external;

    function fund(uint256 amount) external;

    function updateDuration() external;

    function claim() external;

    function claimable(
        address beneficiary
    ) external view returns (uint256 availableAllocated);

    function extraTokensOf(address) external view returns (uint256);

    function totalAllocatedOf(
        address beneficiary
    ) external view returns (uint256);

    function divest() external;

    function failSafe() external;
}
