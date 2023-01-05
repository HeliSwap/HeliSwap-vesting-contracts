// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.8.0) (finance/VestingWallet.sol)
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/ITokenVesting.sol";

/**
 * @title VestingWallet
 * @dev This contract handles the vesting of Eth and ERC20 tokens for a given beneficiary. Custody of multiple tokens
 * can be given to this contract, which will release the token to the beneficiary following a given vesting schedule.
 * The vesting schedule is customizable through the {vestedAmount} function.
 *
 * Any token transferred to this contract will follow the vesting schedule as if they were locked from the beginning.
 * Consequently, if the vesting has already started, any amount of tokens sent to this contract will (at least partly)
 * be immediately releasable.
 */
contract VestingWallet is ITokenVesting, Context {
    event TokensClaimed(address indexed beneficiary, uint256 amount);

    mapping(address => uint256) internal vestedTokensOf;
    mapping(address => uint256) internal claimedOf;
    uint64 internal immutable _start;
    uint64 internal _duration;

    uint256 internal _cliff;

    uint256 internal _freeTokensAmount;

    IERC20 public override token;

    constructor(
        address _tokenAddress,
        address[] memory beneficiaries,
        uint256[] memory balances,
        uint64 startTimestamp,
        uint64 durationSeconds,
        uint256 cliffPeriod,
        uint256 freeTokensAmount
    ) {
        require(_tokenAddress != address(0), "VestingWallet: token is zero address");
        token = IERC20(_tokenAddress);

        for (uint256 i = 0; i < beneficiaries.length; i++) {
            vestedTokensOf[beneficiaries[i]] = balances[i];
        }
        _start = startTimestamp;
        _duration = durationSeconds;
        _cliff = _start + cliffPeriod;
        _freeTokensAmount = freeTokensAmount;
    }

    /**
     * @dev Returns whether an address is a beneficiary for this contract.
     */
    function isBeneficiary(address user) public view virtual returns (bool) {
        return vestedTokensOf[user] > 0;
    }

    /**
     * @dev Getter for the cliff period.
     */
    function cliff() public view virtual returns (uint256) {
        return _cliff;
    }

    /**
     * @dev Getter for the start timestamp.
     */
    function start() public view virtual returns (uint256) {
        return _start;
    }

    /**
     * @dev Getter for the vesting duration.
     */
    function duration() public view virtual returns (uint256) {
        return _duration;
    }

    /**
     * @dev Getter for the free tokens amount.
     */
    function freeTokens() external view virtual returns (uint256) {
        return _freeTokensAmount;
    }

    /**
     * @dev Amount of token already released for a particular beneficiary.
     */
    function released(address beneficiary) public view virtual returns (uint256) {
        return claimedOf[beneficiary];
    }

    /**
     * @dev Getter for the amount of releasable `token` tokens. `token` should be the address of an
     * IERC20 contract.
     */
    function releasable(address beneficiary) public view virtual returns (uint256) {
        return vestedAmount(beneficiary, uint64(block.timestamp)) - released(beneficiary);
    }

    /**
     * @dev Release the tokens that have already vested.
     *
     * Emits a {ERC20Released} event.
     */
    function release(address beneficiary) public virtual {
        uint256 amount = releasable(beneficiary);
        claimedOf[beneficiary] += amount;
        emit TokensClaimed(beneficiary, amount);
        SafeERC20.safeTransfer(token, beneficiary, amount);
    }

    /**
     * @dev Calculates the amount of tokens that has already vested. Default implementation is a linear vesting curve.
     * @dev The total amount of tokens that will be distributed linearly is the token balance of the contract - freeTokensAmount.
     */
    function vestedAmount(address beneficiary, uint64 timestamp) public view virtual returns (uint256) {
        return _vestingSchedule(token.balanceOf(address(this)) - _freeTokensAmount + released(beneficiary), timestamp);
    }

    /**
     * @dev Virtual implementation of the vesting formula. This returns the amount vested, as a function of time, for
     * an asset given its total historical allocation.
     */
    function _vestingSchedule(uint256 totalAllocation, uint64 timestamp) internal view virtual returns (uint256) {
        if (timestamp < _cliff) {
            return 0;
        } else if (timestamp > start() + duration()) {
            return totalAllocation;
        } else {
            return (totalAllocation * (timestamp - start())) / duration();
        }
    }
}