import { task, types } from "hardhat/config";

export default task("sign-mint", "Sign message for minting")
  .addOptionalParam(
    "domainName",
    "EIP-712 domain name",
    "NOMONOUNS",
    types.string
  )
  .addOptionalParam(
    "signerPrivateKey",
    "Key used to sign EIP-712 message",
    "",
    types.string
  )
  .addOptionalParam(
    "signatureVersion",
    "EIP-712 signature version",
    "1",
    types.string
  )
  .addOptionalParam("chainId", "Chain to sign for", "1", types.string)
  .addOptionalParam(
    "verifyingContract",
    "Address of the contract we're signing for",
    "0xbe37CC3F8f7E1E4C264Ba5818482fA75e2D1823e",
    types.string
  )
  .addParam(
    "nounId",
    "The id of the Noun who originated the current Nomo",
    "516"
  )
  .addParam(
    "blockNumber",
    "The number of the block used for the Nomo seed",
    "7796389"
  )
  .setAction(
    async (
      {
        signerPrivateKey,
        domainName,
        signatureVersion,
        chainId,
        verifyingContract,
        nounId,
        blockNumber,
      },
      { ethers }
    ) => {
      const domain = {
        name: domainName,
        version: signatureVersion,
        chainId,
        verifyingContract,
      };

      const types = {
        Minter: [
          { name: "nounsId", type: "uint256" },
          { name: "blockNumber", type: "uint256" },
        ],
      };

      const signer = new ethers.Wallet(signerPrivateKey);

      const signature = await signer._signTypedData(domain, types, {
        nounsId: nounId,
        blockNumber: blockNumber,
      });

      console.log(
        `Signature for nounId ${nounId} and block ${blockNumber} :\n`,
        signature
      );
    }
  );
