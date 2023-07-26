// SPDX-License-Identifier: GPL-3.0

/// @title The NounsToken pseudo-random seed generator
/// this Nouns Seeder has been modified for Nomo Nouns purpose
/// we add nounBlocknumberHash as parameter

/*********************************
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░█████████░░█████████░░░ *
 * ░░░░░░██░░░████░░██░░░████░░░ *
 * ░░██████░░░████████░░░████░░░ *
 * ░░██░░██░░░████░░██░░░████░░░ *
 * ░░██░░██░░░████░░██░░░████░░░ *
 * ░░░░░░█████████░░█████████░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 *********************************/

pragma solidity 0.8.15;

import {INomoNounsSeeder} from "./interfaces/INomoNounsSeeder.sol";
import {INomoNounsDescriptor} from "./interfaces/INomoNounsDescriptor.sol";

contract NomoNounsSeeder is INomoNounsSeeder {
    /**
     * @notice Generate a pseudo-random Noun seed using a provided seed value from the original Noun blockhash and noun ID.
     */
    // prettier-ignore
    function generateSeed(uint256 nounId, bytes32 nounBlocknumberHash, INomoNounsDescriptor descriptor) external view override returns (INomoNounsSeeder.Seed memory) {
        uint256 pseudorandomness = uint256(
            keccak256(abi.encodePacked(nounBlocknumberHash, nounId))
        );

        uint256 backgroundCount = descriptor.backgroundCount();
        uint256 bodyCount = descriptor.bodyCount();
        uint256 accessoryCount = descriptor.accessoryCount();
        uint256 headCount = descriptor.headCount();
        uint256 glassesCount = descriptor.glassesCount();

        return INomoNounsSeeder.Seed({
        nounId : uint40(nounId),
        background : uint40(
                uint48(pseudorandomness) % backgroundCount
            ),
        body : uint40(
                uint48(pseudorandomness >> 48) % bodyCount
            ),
        accessory : uint40(
                uint48(pseudorandomness >> 96) % accessoryCount
            ),
        head : uint40(
                uint48(pseudorandomness >> 144) % headCount
            ),
        glasses : uint40(
                uint48(pseudorandomness >> 192) % glassesCount
            )
        });
    }
}
