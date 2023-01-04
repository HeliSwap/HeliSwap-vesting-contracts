// contracts/TokenVesting.sol
// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.17;

import "./VestingWallet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error TokenVesting__OnlyBeneficiaryAndOwnerHaveRights();
error TokenVesting__OnlyCallableByTimelock();

contract TokenVesting is Ownable, VestingWallet {
    address private _timelock;

    modifier onlyBeneficiaryOrOwner() {
        if (msg.sender != _beneficiary && msg.sender != owner()) {
            revert TokenVesting__OnlyBeneficiaryAndOwnerHaveRights();
        }
        _;
    }

    modifier onlyTimelock() {
        if (msg.sender != _timelock) {
            revert TokenVesting__OnlyCallableByTimelock();
        }
        _;
    }

    event TimelockAddressChanged(address oldAddress, address newAddress);
    event FailSafeOccurred(address token);
    event TokensIncreased(address token, uint256 amount);

     /**
     * @param timelockAddress A timelock contract responsible for triggering updateDuration and failSafe operations.
     * @param beneficiaryAddress The address that will have claim rights over all tokens that this contract owns.
     * @param startTimestamp Start timestamp of the linear distribution.
     * @param durationSeconds Duration of the linear distribution.
     * @param cliff Timestamp after which the beneficiaryAddress can actually claim any unlocked tokens.
     * @param freeTokensAmount Amount of tokens that the beneficiaryAddress can claim right away without waiting.
     */
    constructor(
        address timelockAddress,
        address beneficiaryAddress,
        uint256 cliff,
        uint256 freeTokensAmount,
        uint64 startTimestamp,
        uint64 durationSeconds
    )
        payable
        VestingWallet(
            beneficiaryAddress,
            startTimestamp,
            durationSeconds,
            cliff,
            freeTokensAmount
        )
    {
        _timelock = timelockAddress;
    }

    /**
     * @dev Changes the duration of the vesting schedule.
     * @dev Only triggerable by the timelock.
     */
    function updateDuration(uint64 duration) external onlyTimelock {
        _duration = duration;
    }

    /**
     * @dev Stops the distribution of the tokens in case something is wrong with the contract and transfers all left tokens back to the owner.
     * @dev Only triggerable by the timelock.
     *
     * Emits a {FailSafeOccurred} event.
     */
    function failSafe(address token) public onlyTimelock {
        SafeERC20.safeTransfer(IERC20(token), owner(), IERC20(token).balanceOf(address(this)));
        emit FailSafeOccurred(token);
    }

    /**
     * @dev Increases the tokens for distribution with the option to add free tokens.
     *
     * Emits a {TokensIncreased} event.
     */
    function addTokens(address token, uint256 amount, uint256 freeTokensAmount) external onlyOwner {
        SafeERC20.safeTransferFrom(IERC20(token), msg.sender, address(this), amount);
        _freeTokensAmount += freeTokensAmount;
        emit TokensIncreased(token, amount);
    }

    /**
     * @dev Release the tokens that have already vested.
     *
     * Emits a {ERC20Released} event.
     */
    function release(address token) public override onlyBeneficiaryOrOwner {
        uint256 amount = releasable(token);
        _erc20Released[token] += amount;
        emit ERC20Released(token, amount);
        SafeERC20.safeTransfer(IERC20(token), beneficiary(), amount);
    }

    /**
     * @dev Release free tokens to the beneficiary.
     *
     * Emits a {ERC20Released} event.
     */
    function releaseFreeTokens(address token) public onlyBeneficiaryOrOwner {
        _erc20Released[token] += _freeTokensAmount;
        emit ERC20Released(token, _freeTokensAmount);
        SafeERC20.safeTransfer(IERC20(token), beneficiary(), _freeTokensAmount);
        _freeTokensAmount = 0;
    }

    function timelock() external view returns(address) {
        return _timelock;
    }

    // TODO: Do we want it to be changeable ?
    function changeTimelockAddress(address _newTimelockAddress) external onlyOwner {
        emit TimelockAddressChanged(_timelock, _newTimelockAddress);
        _timelock = _newTimelockAddress;
    }
}
