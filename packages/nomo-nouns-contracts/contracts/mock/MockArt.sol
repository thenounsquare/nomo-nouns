// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.15;

contract MockArt {
    mapping(uint256 => string) public bgs;

    constructor() {
        bgs[0] = "d5d7e1";
        bgs[1] = "e1d7d5";
    }

    function backgrounds(uint256 index) external view returns (string memory) {
        return bgs[index];
    }

}
