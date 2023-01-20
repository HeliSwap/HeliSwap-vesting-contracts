// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/ITokenVesting.sol";
import "./libraries/Errors.sol";

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
contract TokenVesting is Ownable, ITokenVesting {
    mapping(address => uint256) public vestedTokensOf;
    mapping(address => uint256) public claimedOf;
    uint64 public immutable start;
    uint64 public duration;

    uint256 public cliff;

    uint256 public freeTokensPercentage;

    address public timelock;

    IERC20 public token;

    modifier onlyBeneficiaryOrOwner() {
        if (vestedTokensOf[msg.sender] == 0 && msg.sender != owner()) {
            revert Errors.TokenVesting__OnlyBeneficiaryAndOwnerHaveRights();
        }
        _;
    }

    modifier onlyTimelock() {
        if (msg.sender != timelock) {
            revert Errors.TokenVesting__OnlyCallableByTimelock();
        }
        _;
    }

    /**
     * @param _tokenAddress The address of the token that is to be vested.
     * @param _timelockAddress An address of a timelock contract responsible for triggering operations that require a delay.
     * @param beneficiaries The addresses that will have claim rights over the token.
     * @param balances The balances of each beneficiary respectively.
     * @param _startTimestamp Start timestamp of the linear distribution.
     * @param _durationSeconds Duration of the linear distribution.
     * @param _cliff Timestamp after which a beneficiary can actually claim any unlocked tokens.
     * @param _freeTokensPercentage Percentage (an integer from 1 to 100) of the total scheduled tokens for each beneficiary that are unlocked initially without waiting any time.
     */
    constructor(
        address _tokenAddress,
        address _timelockAddress,
        address[] memory beneficiaries,
        uint256[] memory balances,
        uint256 _cliff,
        uint256 _freeTokensPercentage,
        uint64 _startTimestamp,
        uint64 _durationSeconds
    ) {
        require(
            beneficiaries.length == balances.length,
            "Constructor :: Holders and balances differ"
        );
        if (_timelockAddress == address(0)) {
            revert Errors.TokenVesting__TimelockAddressIsZero();
        }

        if (_tokenAddress == address(0)) {
            revert Errors.TokenVesting__TokenAddressIsZero();
        }

        token = IERC20(_tokenAddress);

        optimisticAssociation(_tokenAddress);

        for (uint256 i = 0; i < beneficiaries.length; i++) {
            vestedTokensOf[beneficiaries[i]] = balances[i];
        }

        start = _startTimestamp;
        duration = _durationSeconds;
        cliff = start + _cliff;
        freeTokensPercentage = _freeTokensPercentage;

        timelock = _timelockAddress;
    }

    /**
     * @dev Changes the duration of the vesting schedule.
     * @dev Only triggerable by the timelock.
     * Emits a {DurationUpdated} event.
     */
    function updateDuration(uint64 _duration) external onlyTimelock {
        duration = _duration;
        emit DurationUpdated(_duration);
    }

    /**
     * @dev Stops the distribution of the tokens in case something is wrong with the contract/or some unpredictable event and transfers all left tokens back to the owner.
     * @dev Only triggerable by the timelock.
     *
     * Emits a {FailSafeOccurred} event.
     */
    function failSafe() external onlyTimelock {
        SafeERC20.safeTransfer(token, owner(), token.balanceOf(address(this)));
        emit FailSafeOccurred();
    }

    /**
     * @dev Increases the tokens for distribution for the provided beneficiaries.
     * @dev The contract needs to have the total sum of the amounts as allowance.
     */
    function addTokens(address[] memory beneficiaries, uint256[] memory amounts)
        public
        onlyOwner
    {
        require(
            beneficiaries.length == amounts.length,
            "TokenVesting :: Holders and balances differ"
        );
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < beneficiaries.length; i++) {
            vestedTokensOf[beneficiaries[i]] += amounts[i];
            totalAmount += amounts[i];
        }
        SafeERC20.safeTransferFrom(
            token,
            msg.sender,
            address(this),
            totalAmount
        );
    }

    /**
     * @dev Implementation of the vesting formula. This returns the amount vested, as a function of time, for
     * an asset given its total historical allocation.
     */
    function _vestingSchedule(uint256 totalAllocation, uint64 timestamp)
        internal
        view
        returns (uint256)
    {
        if (timestamp < cliff) {
            return 0;
        } else if (timestamp > start + duration) {
            return totalAllocation;
        } else {
            return (totalAllocation * (timestamp - start)) / duration;
        }
    }

    /**
     * @dev Calculates the amount of tokens that has already vested for the beneficiary. Default implementation is a linear vesting curve.
     * @dev The total amount of tokens that will be distributed linearly to the beneficiary is the allocated balance in vestedTokensOf mapping minus the free tokens
     * which are percent of his total vesting tokens.
     */
    function vestedAmount(address beneficiary, uint64 timestamp)
        public
        view
        returns (uint256)
    {
        uint256 initialUnlock = (vestedTokensOf[beneficiary] *
            freeTokensPercentage) / 100;
        uint256 currentTokensToClaim = _vestingSchedule(
            vestedTokensOf[beneficiary] - initialUnlock,
            timestamp
        );
        return initialUnlock + currentTokensToClaim;
    }

    /**
     * @dev Getter for the amount of claimable tokens for a beneficiary.
     */
    function claimable(address beneficiary) public view returns (uint256) {
        return
            vestedAmount(beneficiary, uint64(block.timestamp)) -
            claimedOf[beneficiary];
    }

    /**
     * @dev Release the tokens that have already vested.
     *
     * Emits a {TokensClaimed} event.
     */
    function claim() public onlyBeneficiaryOrOwner {
        uint256 amount = claimable(msg.sender);
        claimedOf[msg.sender] += amount;
        SafeERC20.safeTransfer(token, msg.sender, amount);
        emit TokensClaimed(msg.sender, amount);
    }

    /**
     * @dev Change the timelock address.
     *
     * Emits a {TimelockAddressChanged} event.
     */
    function changeTimelockAddress(address _newTimelockAddress)
        external
        onlyOwner
    {
        if (_newTimelockAddress == address(0)) {
            revert Errors.TokenVesting__TimelockAddressIsZero();
        }
        timelock = _newTimelockAddress;
        emit TimelockAddressChanged(_newTimelockAddress);
    }

    /**
     * @dev Change the address of the vesting token.
     * Note: No need to check whether the parameter _newTokenAddress is 0x because the TimeLock does not allow 0-byte input anyway.
     *
     * Emits a {TokenAddressChanged} event.
     */
    function changeTokenAddress(address _newTokenAddress)
        external
        onlyTimelock
    {
        token = IERC20(_newTokenAddress);
        emit TokenAddressChanged(_newTokenAddress);
    }

    function optimisticAssociation(address _token) private {
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
