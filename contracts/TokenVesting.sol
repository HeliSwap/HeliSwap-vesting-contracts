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
    event TokensIncreased(address beneficiary, uint256 amount);

     /**
     * @param tokenAddress The address of the token that is to be vested.
     * @param timelockAddress An address of a timelock contract responsible for triggering updateDuration and failSafe operations.
     * @param beneficiaries The addresses that will have claim rights over the token.
     * @param balances The balances of each address respectively that is scheduled to be vested.
     * @param startTimestamp Start timestamp of the linear distribution.
     * @param durationSeconds Duration of the linear distribution.
     * @param cliff Timestamp after which a beneficiary can actually claim any unlocked tokens.
     * @param freeTokensAmount Amount of tokens that the beneficiaryAddress can claim right away without waiting.
     */
    constructor(
        address tokenAddress,
        address timelockAddress,
        address[] memory beneficiaries,
        uint256[] memory balances,
        uint256 cliff,
        uint256 freeTokensAmount,
        uint64 startTimestamp,
        uint64 durationSeconds
    )
        VestingWallet(
            tokenAddress,
            beneficiaries,
            balances,
            startTimestamp,
            durationSeconds,
            cliff,
            freeTokensAmount
        )
    {
        require(
            beneficiaries.length == balances.length, "Constructor :: Holders and balances differ"
        );
        require(_timelock != address(0), "VestingWallet: timelock is zero address");
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
    function failSafe() external onlyTimelock {
        SafeERC20.safeTransfer(token, owner(), token.balanceOf(address(this)));
        emit FailSafeOccurred();
    }

    /**
     * @dev Increases the tokens for distribution for the beneficiary with the option to add free tokens.
     *
     * Emits a {TokensIncreased} event.
     */
    function addTokens(address beneficiary, uint256 amount, uint256 freeTokensAmount) external onlyOwner {
        SafeERC20.safeTransferFrom(token, msg.sender, address(this), amount);
        _freeTokensAmount += freeTokensAmount;
        vestedTokensOf[beneficiary] += amount;
        emit TokensIncreased(beneficiary, amount);
    }

    /**
     * @dev Release the tokens that have already vested.
     *
     * Emits a {TokensClaimed} event.
     */
    function claim() public override onlyBeneficiaryOrOwner {
        uint256 amount = releasable(token);
        claimedOf[msg.sender] += amount;
        emit TokensClaimed(msg.sender, amount);
        SafeERC20.safeTransfer(IERC20(token), msg.sender, amount);
    }

    /**
     * @dev Release free tokens to the beneficiary.
     *
     * Emits a {ERC20Released} event.
     */
    function claimFreeTokens(address token) public onlyBeneficiaryOrOwner {
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
