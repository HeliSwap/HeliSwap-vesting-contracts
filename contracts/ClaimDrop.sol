// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.17;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./Timelock.sol";
import "./libs/Errors.sol";
import "./libs/TransferHelper.sol";
import "./interfaces/IClaimDrop.sol";

/**
 * @title ClaimDrop
 * @dev This contract handles the vesting of an ERC20 token for multiple beneficiaries. Custody of the token
 * should be given to this contract, which will release the token to a beneficiary following a given vesting schedule.
 *
 * The token transferred to this contract will follow the vesting schedule as if it was locked from the beginning.
 * The contract takes into account a cliff period after which the actual claiming of any unlocked tokens should begin.
 * Some percentage of the total tokens allocated for distribution to a beneficiary are released initially without waiting any time.
 */
contract ClaimDrop is Timelock, ReentrancyGuard, IClaimDrop {
    uint256 public override start;
    uint256 public override end;
    uint256 public override cliffEnd;
    uint256 public override claimExtraTime;
    uint256 public override tokensNotVestedPercentage;

    IERC20 public override token;
    bool public override failMode;
    uint256 public override index;
    uint256 public override totalAllocated;

    mapping(address => uint256) public override claimedOf;
    mapping(address => uint256) public override vestedTokensOf;

    modifier onlyBeneficiary() {
        if (vestedTokensOf[msg.sender] == 0) {
            revert Errors.ClaimDrop__OnlyBeneficiary();
        }
        _;
    }

    /**
     * @param tokenAddress The address of the token that is to be vested.
     * @param notVestedPercentage Percentage (an integer from 1 to 1e18) of the total scheduled tokens for each beneficiary that are unlocked initially without waiting any time.
     * @param defaultLockTime Time of a function to be scheduled for execution
     */
    constructor(
        address tokenAddress,
        uint256 notVestedPercentage,
        uint256 defaultLockTime
    ) Timelock(defaultLockTime) {
        if (notVestedPercentage > 1e18) {
            revert Errors.ClaimDrop__PercentageOutOfRange();
        }

        _optimisticAssociation(tokenAddress);

        index = 1e18;
        token = IERC20(tokenAddress);
        tokensNotVestedPercentage = notVestedPercentage;

        emit NotVestedPercentage(notVestedPercentage);
    }

    /// @notice Load all the beneficiaries with their allocation and fund the claim drop before the vesting is started
    function addBeneficiaries(
        address[] memory beneficiaries,
        uint256[] memory balances
    ) external override onlyOwner {
        if (start > 0) {
            revert Errors.ClaimDrop__CanNotAddMoreBeneficiaries();
        }

        if (beneficiaries.length != balances.length) {
            revert Errors.ClaimDrop__TooMuchBeneficiariesOrBalances();
        }

        uint256 totalBalance;
        for (uint256 i = 0; i < beneficiaries.length; i++) {
            vestedTokensOf[beneficiaries[i]] = balances[i];
            totalBalance += balances[i];
        }

        TransferHelper.safeTransferFrom(
            address(token),
            msg.sender,
            address(this),
            totalBalance
        );

        totalAllocated += totalBalance;

        emit BeneficiariesAdded(beneficiaries, balances);
    }

    /// @notice Configure and start the vesting period
    function startVesting(
        uint256 vestingDuration,
        uint256 cliffDuration,
        uint256 claimExtraDuration
    ) external override onlyOwner {
        if (start > 0) {
            revert Errors.ClaimDrop__CanNotReStart();
        }

        if (cliffDuration >= vestingDuration) {
            revert Errors.ClaimDrop__InvalidCliffDuration();
        }

        start = block.timestamp;
        end = block.timestamp + vestingDuration;
        cliffEnd = block.timestamp + cliffDuration;
        claimExtraTime = claimExtraDuration;

        emit VestingStarted(start, end, cliffEnd, claimExtraDuration);
    }

    /// @notice In case one decides to distribute exta tokens among the users. They will be distributed based on the
    /// @notice initail allocation of each user
    function fund(uint256 amount) external override nonReentrant {
        TransferHelper.safeTransferFrom(
            address(token),
            msg.sender,
            address(this),
            amount
        );

        uint256 newTotalAllocated = totalAllocated + amount;
        index =
            index +
            ((index *
                (((newTotalAllocated - totalAllocated) * 1e18) /
                    totalAllocated)) / 1e18);

        totalAllocated = newTotalAllocated;

        emit Funded(amount, index, totalAllocated);
    }

    /// @notice Update the duration by increasing/decreasing the already existing one
    /// @dev No need of onlyOwner modifier as scheduleExpired validates if it was scheduled or not, but it can
    /// @dev be scheduled only from the owner
    function updateDuration()
        external
        override
        scheduleExpired(IClaimDrop.updateDuration.selector)
    {
        uint256 vestingDuration = abi.decode(
            locks[IClaimDrop.updateDuration.selector].params,
            (uint256)
        );
        end = start + vestingDuration;
        if (cliffEnd >= end) {
            revert Errors.ClaimDrop__InvalidVestingDuration();
        }

        emit DurationUpdated(vestingDuration, end);
    }

    /// @notice Once the vesting vesting starts, every user can claim his LP tokens share
    /// @dev Claiming is based on a linear vesting, so a user can not claim all his available
    /// @dev balance at once at the beginning. In the case there is a notVestedPercentage configured,
    /// @dev a part of the initially allocated tokens will unlocked immediately
    function claim() external override onlyBeneficiary {
        uint256 availableToClaim = claimable(msg.sender);
        claimedOf[msg.sender] += availableToClaim;

        TransferHelper.safeTransfer(
            address(token),
            msg.sender,
            availableToClaim
        );

        emit TokensClaimed(msg.sender, availableToClaim);
    }

    /// @notice Calculates what is the amount a beneficiary is able to claim based on a linear vesting
    /// @dev In the case there is a notVestedPercentage configured, a part of the initially allocated tokens will unlocked immediately
    /// @dev In the case the balance of the claim drop is bigger that the total amount being allocated to all of the beneficiaries
    /// @dev the difference if getting distributed among the beneficiaries based on their part of the initial allocation
    /// @dev Once the cliff period expires, then the claimable amount starts to accumulate
    function claimable(
        address beneficiary
    ) public view override returns (uint256 availableAllocated) {
        if (
            vestedTokensOf[beneficiary] == 0 ||
            block.timestamp > end + claimExtraTime ||
            block.timestamp <= cliffEnd ||
            failMode
        ) {
            return (0);
        }

        uint256 tokensNotVested = (vestedTokensOf[beneficiary] *
            tokensNotVestedPercentage) / 1e18;
        uint256 tokensVested = totalAllocatedOf(beneficiary) - tokensNotVested;

        uint256 timeRatio = ((block.timestamp - cliffEnd) * 1e18) /
            (end - cliffEnd);
        if (timeRatio > 1e18) {
            timeRatio = 1e18;
        }

        availableAllocated =
            (((tokensVested * timeRatio) / 1e18) + tokensNotVested) -
            claimedOf[beneficiary];

        // In the case of math inaccuracy in working with percentages, the last user could receive slighly less
        if (availableAllocated > token.balanceOf(address(this))) {
            availableAllocated = token.balanceOf(address(this));
        }
    }

    /// @notice In the case the balance of the claim drop is bigger than the total tokens being allocated
    /// @notice calculate the distribution a user should receive from that difference
    function extraTokensOf(
        address beneficiary
    ) public view override returns (uint256) {
        return totalAllocatedOf(beneficiary) - vestedTokensOf[beneficiary];
    }

    /// @notice Returns the initial allocated tokens plus the ones that could be distributed afterwards
    function totalAllocatedOf(
        address beneficiary
    ) public view override returns (uint256) {
        return (vestedTokensOf[beneficiary] * index) / 1e18;
    }

    /// @notice Typically there is extra time(claimExtraTime) once vault vesting time expires. That is the time
    /// @notice left for the users to claim their tokens. Once expire, the owner, who initially fund the contract can withdraw
    /// @notice all outstanding LP tokens, as they are assumed as "locked" ones
    /// @notice Once divest happens, the contract is not usable anymore
    function divest() external override onlyOwner {
        if (end + claimExtraTime > block.timestamp) {
            revert Errors.ClaimDrop__DivestForbidden();
        }

        uint256 amount = token.balanceOf(address(this));
        TransferHelper.safeTransfer(address(token), msg.sender, amount);

        emit Divest(amount);
    }

    /// @notice Stops the distribution of the tokens in case something is wrong with the contract/or some unpredictable event and transfers all left tokens back to the owner.
    /// @dev No need of onlyOwner modifier as scheduleExpired validates if it was scheduled or not, but it can
    /// @dev be scheduled only from the owner
    function failSafe() external scheduleExpired(IClaimDrop.failSafe.selector) {
        failMode = true;
        uint256 safeAmount = token.balanceOf(address(this));
        TransferHelper.safeTransfer(address(token), owner(), safeAmount);

        emit FailSafeOccurred(safeAmount);
    }

    function _optimisticAssociation(address _token) internal {
        (bool success, bytes memory result) = address(0x167).call(
            abi.encodeWithSignature(
                "associateToken(address,address)",
                address(this),
                _token
            )
        );
        require(success, "HTS Precompile: CALL_EXCEPTION");
        int32 responseCode = abi.decode(result, (int32));

        //Success = 22; Non-HTS token (erc20) = 167
        require(
            responseCode == 22 || responseCode == 167,
            "HTS Precompile: CALL_ERROR"
        );
    }
}
