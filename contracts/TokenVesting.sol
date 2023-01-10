// contracts/TokenVesting.sol
// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.17;

import "./VestingWallet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error TokenVesting__OnlyBeneficiaryAndOwnerHaveRights();
error TokenVesting__OnlyCallableByTimelock();

/**
 * @title TokenVesting
 * @dev This contract handles the vesting of an ERC20 token for multiple beneficiaries. Custody of the token
 * should be given to this contract, which will release the token to a beneficiary following a given vesting schedule.
 * The vesting schedule is customizable through the {vestedAmount} function.
 *
 * The token transferred to this contract will follow the vesting schedule as if it was locked from the beginning.
 * The contract takes into account a cliff period after which the actual claiming of any unlocked tokens should begin.
 * Some percentage of the total tokens allocated for distribution to a beneficiary are released initially without waiting any time.
 */
contract TokenVesting is Ownable, VestingWallet {
    address private _timelock;

    modifier onlyBeneficiaryOrOwner() {
        if (vestedTokensOf[msg.sender] == 0 && msg.sender != owner()) {
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
    event FailSafeOccurred();
    event VestingTokensIncreased(address beneficiary, uint256 amount);

     /**
     * @param tokenAddress The address of the token that is to be vested.
     * @param timelockAddress An address of a timelock contract responsible for triggering updateDuration and failSafe operations.
     * @param beneficiaries The addresses that will have claim rights over the token.
     * @param balances The balances of each address respectively that is scheduled to be vested.
     * @param startTimestamp Start timestamp of the linear distribution.
     * @param durationSeconds Duration of the linear distribution.
     * @param cliff Timestamp after which a beneficiary can actually claim any unlocked tokens.
     * @param freeTokensPercentage Percentage of the total scheduled tokens for each beneficiary that are unlocked initially without waiting any time.
     */
    constructor(
        address tokenAddress,
        address timelockAddress,
        address[] memory beneficiaries,
        uint256[] memory balances,
        uint256 cliff,
        uint256 freeTokensPercentage,
        uint64 startTimestamp,
        uint64 durationSeconds
    )
        VestingWallet(
            tokenAddress,
            beneficiaries,
            balances,
            cliff,
            freeTokensPercentage,
            startTimestamp,
            durationSeconds 
        )
    {
        require(
            beneficiaries.length == balances.length, "Constructor :: Holders and balances differ"
        );
        require(timelockAddress != address(0), "VestingWallet: timelock is zero address");
        _timelock = timelockAddress;
    }

    /**
     * @dev Changes the duration of the vesting schedule.
     * @dev Only triggerable by the timelock.
     */
    function updateDuration(uint64 duration) external override onlyTimelock {
        _duration = duration;
    }

    /**
     * @dev Stops the distribution of the tokens in case something is wrong with the contract and transfers all left tokens back to the owner.
     * @dev Only triggerable by the timelock.
     *
     * Emits a {FailSafeOccurred} event.
     */
    function failSafe() external override onlyTimelock {
        SafeERC20.safeTransfer(token, owner(), token.balanceOf(address(this)));
        emit FailSafeOccurred();
    }

    /**
     * @dev Increases the tokens for distribution for а beneficiary.
     *
     * Emits a {VestingTokensIncreased} event.
     */
    function addTokens(address beneficiary, uint256 amount) external override onlyOwner {
        SafeERC20.safeTransferFrom(token, msg.sender, address(this), amount);
        vestedTokensOf[beneficiary] += amount;
        emit VestingTokensIncreased(beneficiary, amount);
    }

    /**
     * @dev Release the tokens that have already vested.
     *
     * Emits a {TokensClaimed} event.
     */
    function claim() public override onlyBeneficiaryOrOwner {
        uint256 amount = claimable(msg.sender);
        claimedOf[msg.sender] += amount;
        SafeERC20.safeTransfer(token, msg.sender, amount);
        emit TokensClaimed(msg.sender, amount);
    }

    function timelock() external override view returns(address) {
        return _timelock;
    }

    // TODO: Do we want it to be changeable ? Maybe no need
    function changeTimelockAddress(address _newTimelockAddress) external onlyOwner {
        emit TimelockAddressChanged(_timelock, _newTimelockAddress);
        _timelock = _newTimelockAddress;
    }
}
