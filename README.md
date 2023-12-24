# NFT Marketplace Hardhat

[![NFTM](https://circleci.com/gh/v7m/nft-marketplace-hardhat.svg?style=shield)](https://app.circleci.com/pipelines/github/v7m/nft-marketplace-hardhat)

> *This is an educational project with the purpose of acquiring hands-on experience in web3 application development using smart contracts written in Solidity.*

The NFT Marketplace project consists of 3 parts:

[Hardhat App](https://github.com/v7m/nft-marketplace-hardhat): This component is responsible for managing smart contracts and includes deployment scripts, using the popular development environment for Ethereum smart contracts.

[Next.js App](https://github.com/v7m/nft-marketplace-nextjs): This part serves as the frontend of the application and interacts with on-chain logic within the Ethereum ecosystem.

[The Graph App](https://github.com/v7m/nft-marketplace-graph): This component handles the storage and indexing of blockchain events. The Graph is a widely used indexing and querying protocol for blockchain data.

## NFT Marketplace Features:

- Compatible with various web3 wallets.
- Trade various NFT types: Basic (IPFS hosted) and Dynamic SVG (on-chain storage).
- Buy NFT tokens listed by others or set your own price when selling.
- Easily modify your price or cancel a listing for your tokens at any time.
- Users can mint and list new NFTs directly within the marketplace.
- Sellers have full control over their trading earnings, which are withdrawable at any time.

## Built with:
- Solidity
- OpenZeppelin
- Chainlink VRF
- Hardhat
- Ethers.js
- Next.js
- Moralis
- The Graph
- IPFS

## Smart contract addresses:
- `NftMarketplace`: [0x397f76438DfcA65501c91995e38A8aAE7e13848A](https://sepolia.etherscan.io/address/0x397f76438DfcA65501c91995e38A8aAE7e13848A)
- `BasicIpfsNft`: [0x799c27a23a2eD1473A7Bc1F4704aFc688a9E8f6e](https://sepolia.etherscan.io/address/0x799c27a23a2eD1473A7Bc1F4704aFc688a9E8f6e)
- `DynamicSvgNft`: [0xB9BD4D25D32DD41cf3D82Eafb6E927b06e68c6b8](https://sepolia.etherscan.io/address/0xB9BD4D25D32DD41cf3D82Eafb6E927b06e68c6b8)

# Getting Started

```
git clone https://github.com/v7m/nft-marketplace-hardhat
cd nft-marketplace-hardhat
yarn
```

# Usage

## Deploy:

```
yarn hardhat deploy
```

## Testing

```
yarn hardhat test
```

## Coverage

```
yarn coverage
```

## Linting

```
yarn lint
```

# Deployment to a testnet (Sepolia)

1. Setup environment variables

To get started, configure the following environment variables, `SEPOLIA_RPC_URL` `and PRIVATE_KEY`. You can store them in a `.env` file, similar to the example provided in `.env.example`.

- `PRIVATE_KEY`: This should be the private key associated with your account. **NOTE:** For development purposes, please use a key that doesn't contain any real funds.
- `SEPOLIA_RPC_URL`: This is the URL of the Sepolia testnet node you're using. You can set up a free testnet node with [Alchemy](https://alchemy.com/?a=673c802981).

2. Obtain testnet ETH

Visit [faucets.chain.link](https://faucets.chain.link/) to acquire some testnet `ETH` and `LINK`. Your newly acquired `ETH` and `LINK` will appear in your Metamask wallet.

3. Setup a Chainlink VRF subscription ID

Go to [vrf.chain.link](https://vrf.chain.link/) and create a new subscription to obtain a subscription ID. If you already have one, you can reuse it. If you need guidance, you can follow the provided instructions [here](https://docs.chain.link/vrf/v2/subscription/examples/get-a-random-number). After this step, you should have:

1. A subscription ID
2. Your subscription should be funded with LINK
3. Deploy

Add your `SEPOLIA_SUBSCRIPRION_ID` to `.env` file.

Then run:
```
yarn hardhat deploy --network sepolia
```

And copy / remember the contract address.

4. Add your contract address as a Chainlink VRF Consumer

Return to [vrf.chain.link](https://vrf.chain.link), and within your subscription, locate the option to `Add consumer` and insert your contract address. Additionally, ensure that the contract is funded with a minimum of 13 `LINK` tokens.
