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

    uint256 internal _freeTokensPercentage;

    IERC20 public override token;

    constructor(
        address _tokenAddress,
        address[] memory beneficiaries,
        uint256[] memory balances,
        uint256 cliffPeriod,
        uint256 freeTokensPercentage,
        uint64 startTimestamp,
        uint64 durationSeconds
    ) {
        require(_tokenAddress != address(0), "VestingWallet: token is zero address");
        token = IERC20(_tokenAddress);

        for (uint256 i = 0; i < beneficiaries.length; i++) {
            vestedTokensOf[beneficiaries[i]] = balances[i];
        }
        _start = startTimestamp;
        _duration = durationSeconds;
        _cliff = _start + cliffPeriod;
        _freeTokensPercentage = freeTokensPercentage;
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
     * @dev Getter for the free tokens percentage.
     */
    function freeTokensPercentage() external view virtual returns (uint256) {
        return _freeTokensPercentage;
    }

    /**
     * @dev Amount of token already released for a particular beneficiary.
     */
    function released(address beneficiary) public view virtual returns (uint256) {
        return claimedOf[beneficiary];
    }

    /**
     * @dev Getter for the amount of claimable `token` tokens. `token` should be the address of an
     * IERC20 contract.
     */
    function claimable(address beneficiary) public view virtual returns (uint256) {
        return vestedAmount(beneficiary, uint64(block.timestamp)) - released(beneficiary);
    }

    /**
     * @dev Getter for the amount of scheduled tokens to vest for a beneficiary.
     */
    function scheduledTokens(address beneficiary) public view virtual returns (uint256) {
        return vestedTokensOf[beneficiary];
    }

    /**
     * @dev Claim the tokens that have already vested.
     *
     * Emits a {ERC20Released} event.
     */
    function claim() public virtual {
        uint256 amount = claimable(msg.sender);
        claimedOf[msg.sender] += amount;
        emit TokensClaimed(msg.sender, amount);
        SafeERC20.safeTransfer(token, msg.sender, amount);
    }

    /**
     * @dev Calculates the amount of tokens that has already vested. Default implementation is a linear vesting curve.
     * @dev The total amount of tokens that will be distributed linearly is the token balance of the contract - freeTokensAmount.
     */
    function vestedAmount(address beneficiary, uint64 timestamp) public view virtual returns (uint256) {
        uint256 initialUnlock = vestedTokensOf[beneficiary] / _freeTokensPercentage;
        uint256 currentTokensToClaim = _vestingSchedule(vestedTokensOf[beneficiary] - initialUnlock, timestamp);
        return initialUnlock + currentTokensToClaim;
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

    /**
     * @dev Changes the duration of the vesting schedule.
     * @dev Only triggerable by the timelock.
     */
    function updateDuration(uint64 duration) external virtual {
        _duration = duration;
    }

    /**
     * @dev Increases the tokens for distribution for а beneficiary.
     *
     * Emits a {TokensIncreased} event.
     */
    function addTokens(address beneficiary, uint256 amount) external virtual {
        SafeERC20.safeTransferFrom(token, msg.sender, address(this), amount);
        vestedTokensOf[beneficiary] += amount;
    }

    /**
     * @dev Stops the distribution of the tokens in case something is wrong with the contract and transfers all left tokens back to the owner.
     * @dev Only triggerable by the timelock.
     */
    function failSafe() external virtual {}

    function timelock() external virtual view returns(address) {}
}