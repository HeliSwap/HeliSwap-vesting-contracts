// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.17;

library Errors {
    error TokenVesting__OnlyBeneficiaryAndOwnerHaveRights();
    error TokenVesting__OnlyCallableByTimelock();
    error TokenVesting__TokenAddressIsZero();
    error TokenVesting__TimelockAddressIsZero();
}
