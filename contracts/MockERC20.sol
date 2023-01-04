// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.17;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("MockERC20", "MERC20"){
        _mint(msg.sender, 21000000000000000000000000); // mint 21M tokens to msg.sender
    }
}