// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title NFTToken
 * @dev Token ERC20 với tên NFTToken và ký hiệu NFT
 * @notice Token này được tạo với tổng supply ban đầu là 1,000,000 NFT
 */
contract NFTToken is ERC20 {
    constructor() ERC20("NFTToken", "NFT") {
        // Mint 1,000,000 NFT tokens cho người deploy
        _mint(msg.sender, 1000000 * (10 ** uint256(decimals())));
    }
}
