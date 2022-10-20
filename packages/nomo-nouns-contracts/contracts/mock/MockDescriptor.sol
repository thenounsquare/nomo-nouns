// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.15;

import {INounsDescriptorMinimal} from "../../nouns-contracts/NounsDescriptorV2/contracts/interfaces/INounsDescriptorMinimal.sol";
import {INounsSeeder} from "../../nouns-contracts/NounsDescriptorV2/contracts/interfaces/INounsSeeder.sol";

contract MockDescriptor is INounsDescriptorMinimal {
    function backgroundCount() external pure returns (uint256) {
        return 2;
    }

    function bodyCount() external pure returns (uint256) {
        return 20;
    }

    function accessoryCount() external pure returns (uint256) {
        return 20;
    }

    function headCount() external pure returns (uint256) {
        return 20;
    }

    function glassesCount() external pure returns (uint256) {
        return 20;
    }

    function tokenURI(uint256 tokenId, INounsSeeder.Seed memory seed) external pure returns (string memory) {
        return '123';
    }

    function dataURI(uint256 tokenId, INounsSeeder.Seed memory seed) external pure returns (string memory) {
        return '123';
    }
}
