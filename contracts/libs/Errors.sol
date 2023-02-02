// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.17;

library Errors {
    error ClaimDrop__CanNotReStart();
    error ClaimDrop__DivestForbidden();
    error ClaimDrop__OnlyBeneficiary();
    error ClaimDrop__InvalidCliffDuration();
    error ClaimDrop__PercentageOutOfRange();
    error ClaimDrop__InvalidVestingDuration();
    error ClaimDrop__OnlyCallableByTimelock();
    error ClaimDrop__InvalidClaimExtraDuration();
    error ClaimDrop__CanNotAddMoreBeneficiaries();
    error ClaimDrop__TooMuchBeneficiariesOrBalances();
}
