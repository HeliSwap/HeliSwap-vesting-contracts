// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IClaimDrop {
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

    function start() external view returns (uint256);

    function end() external view returns (uint256);

    function cliffEnd() external view returns (uint256);

    function claimExtraTime() external view returns (uint256);

    function tokensNotVestedPercentage() external view returns (uint256);

    function token() external view returns (IERC20);

    function timelock() external view returns (address);

    function totalAllocated() external view returns (uint256);

    function extraTokensOf(address beneficiary) external view returns (uint256);

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

    function updateDuration(uint256 vestingDuration) external;

    function claim() external;

    function claimable(address beneficiary)
        external
        view
        returns (uint256 availableToClaim, uint256 availableVested);

    function totalAllocatedOf(address beneficiary)
        external
        view
        returns (uint256);

    function divest() external;
}
