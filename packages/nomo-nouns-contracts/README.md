# NOMO Nouns Contracts

This package contains the smart contracts for the NOMO Nouns protocol.

## Development

### Install dependencies

```sh
yarn
```

### Environment Setup

Copy `.env.example` to `.env` and fill in fields

### Commands

```sh
# Compile Solidity
yarn build


# Deploy (Testnet/Mainnet)
yarn deploy --network [network]
```

## Contract Deployment

The project includes scripts for deploying smart contracts to various networks. These scripts are located in the `tasks` folder.

### Deployment Prerequisites

1. **Set up environment variables**:

   Create a `.env` file in this directory with the necessary private keys and API keys:

   ```
   PRIVATE_KEY=your_private_key
   ETHERSCAN_API_KEY=your_etherscan_api_key
   OPTIMISM_API_KEY=your_optimism_api_key
   ```

2. **Configure network settings**:

   Update the network configuration in `hardhat.config.js` if needed.

### Deployment Order

The contracts must be deployed in a specific order, as later contracts depend on the addresses of previously deployed contracts. Follow this sequence:

1. **Deploy NFT Descriptor Library**:

   ```bash
   npx hardhat deploy-nft-descriptor --network optimismSepolia
   ```

   Save the deployed address for use in the next step.

2. **Deploy Seeder Contract**:

   ```bash
   npx hardhat deploy-seeder --network optimismSepolia
   ```

   Save the deployed address for use in later steps.

3. **Deploy Token Contract**:

   ```bash
   npx hardhat deploy-token --network optimismSepolia --seeder SEEDER_ADDRESS --descriptor DESCRIPTOR_ADDRESS --treasury TREASURY_ADDRESS --minter MINTER_ADDRESS
   ```

   Replace the placeholder addresses with your actual addresses:
   - `SEEDER_ADDRESS`: The address of the seeder contract deployed in step 2
   - `DESCRIPTOR_ADDRESS`: This will be set later, use a temporary address for now
   - `TREASURY_ADDRESS`: The address that will receive funds from auctions
   - `MINTER_ADDRESS`: The address authorized to mint tokens

   Save the deployed token address for use in later steps.

4. **Deploy Descriptor Contract**:

   ```bash
   npx hardhat deploy-descriptor --network optimismSepolia --art ART_ADDRESS --renderer RENDERER_ADDRESS --nomoToken TOKEN_ADDRESS --nftdescriptor NFT_DESCRIPTOR_ADDRESS
   ```

   Replace the placeholder addresses with your actual addresses:
   - `ART_ADDRESS`: The address of the art contract
   - `RENDERER_ADDRESS`: The address of the renderer contract
   - `TOKEN_ADDRESS`: The address of the token contract deployed in step 3
   - `NFT_DESCRIPTOR_ADDRESS`: The address of the NFT descriptor library deployed in step 1

5. **Update Token Contract with Descriptor**:

   After deploying the descriptor, you need to update the token contract to use it:

   ```bash
   # Call the setDescriptor function on the token contract
   npx hardhat run scripts/set-descriptor.js --network optimismSepolia
   ```

   Make sure to update the script with the correct token and descriptor addresses.

6. **Deploy Auction House** (if needed):

   ```bash
   npx hardhat deploy-mock-auction --network optimismSepolia
   ```

### Verifying Contracts on Block Explorer

After deployment, verify your contracts on the block explorer:

```bash
# Verify NFT Descriptor
npx hardhat verify --network optimismSepolia NFT_DESCRIPTOR_ADDRESS

# Verify Seeder
npx hardhat verify --network optimismSepolia SEEDER_ADDRESS

# Verify Token
npx hardhat verify --network optimismSepolia TOKEN_ADDRESS SEEDER_ADDRESS DESCRIPTOR_ADDRESS TREASURY_ADDRESS MINTER_ADDRESS

# Verify Descriptor (this requires libraries)
npx hardhat verify --network optimismSepolia --libraries NomoNFTDescriptor:NFT_DESCRIPTOR_ADDRESS DESCRIPTOR_ADDRESS ART_ADDRESS RENDERER_ADDRESS TOKEN_ADDRESS
```

### Signing Messages for Minting

To sign messages for minting tokens:

```bash
npx hardhat sign-mint --network optimismSepolia --verifyingContract TOKEN_ADDRESS --nounId NOUN_ID --blockNumber BLOCK_NUMBER --signerPrivateKey PRIVATE_KEY
```

Replace the placeholders with your actual values:
- `TOKEN_ADDRESS`: The address of your deployed token contract
- `NOUN_ID`: The ID of the Noun who originated the current Nomo
- `BLOCK_NUMBER`: The block number used for the Nomo seed
- `PRIVATE_KEY`: The private key of the authorized signer

## After Deployment

After deploying the contracts, you need to:

1. Update the contract addresses in the SDK configuration (see [contract-sdks README](../contract-sdks/README.md))
2. Update the ABIs in the SDK if they've changed
3. Build and publish the updated SDK
4. Update the functions project to use the new SDK

## Contract Interaction

You can interact with deployed contracts using Hardhat tasks:

```bash
# Example: Mint a token on Optimism Sepolia
npx hardhat mint --network optimismSepolia --to 0xYourAddress
```

For more detailed information on available tasks, run:

```bash
npx hardhat --help
```
