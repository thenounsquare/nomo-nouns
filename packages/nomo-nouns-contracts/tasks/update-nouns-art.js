import { Result } from 'ethers/lib/utils';
import { task, types } from 'hardhat/config';

task("update-nouns-art", "Add new traits to the nouns art contract")
.addOptionalParam(
    'nftDescriptor',
    'The `NFTDescriptorV2` contract address',
    '0x3315C008B23c5733759CC46E6ac5798Fd7f7D066',
    types.string,
  )
.addOptionalParam(
    'nounsDescriptor',
    'The `NounsDescriptorV2` contract address',
    "0x0A07DADb5A3f6f05139c3D46fE4d8be617323Ee2",
    types.string
  )
  .addOptionalParam(
    "encodeCompressed",
    "the encodeCompressed parameter value",
    "0x9552bd6e1341109e9fdddbb36327e7c336820491e2629aab235158a2463c041dbd6b0a1a27121248344616f8159c26dd35112f716f908697e0dbf539890fe5ce59e9db996fbed9ddd99d256a1ca7cd32c5cd32b72ce79b665dbe34eb7adaa27f6cd64dcbfef65db31e35cb443fc9bd1ada8864c5c401291daca2a5c233889accac74c91907281d3e603eff68e5964cc9dd3cd8e13e4fc443aa4cbf66b08a618522f812d00d9c57b6b2ad65df8d5fa87fa4863a39539c3beae6bceee451cd1ad20219eb38d7023514bae6220677b9f7a560707e10db700979c97a93cf64e09b42b157b2d6c2d0b802f8b96e2ce296e43c0174affa3f517432b25d5279462c787519571892c8e801f73e6a97147105fa58e38038f822e8960c000eb952e5ab1c9291b66ffef8784eee7868f3def82df0ed1efbaeff4b723c36fe7e2939497c4dd58fe853f4dea26abc35e0a8239634f8fe26f85f15fcdfe1330d79b2b6d865cb35e4f2159fd52157d2a87b057dc28e7dd99c7e247e4e24a20190a2962d50cb1475022ef85d00754d1db910c73b4fd19fe97efdae8f25452f471dfcad394f2c004b61ae98ecfa173cd10b9e336c9801793cfbce4f27836c3089e6761183eb9c17d5eb2e34709d083481f5fc00c8e6fbd5ff83f4c5304e67bd8c67f25b669ce99f183e5b74ceb35bd86b9cf5b902626cbdc2b7e80554bee60f98bf57d85909e5fa5eb3b39ec529507bdeafc3be819dcc9ef4fc7c467af2da29f5ca0ea97f4d8f4b8f38f080c05d8d4794941630be771701975ed316cea5d433ca5d8ebffbf5ff485adecf1c6ad9ea823342ec72c34db8878f49ad66136287a5b7c327a0e105ff01",
    types.string
  )
  .addOptionalParam(
    "decompressedLength",
    "the decompressedLength parameter value",
    "1952",
    types.string
  )
  .addOptionalParam(
    "imageCount",
    "The imageCount parameter value",
    "8",
    types.string
  )
  .setAction( async ({ nftDescriptor, nounsDescriptor, encodeCompressed, decompressedLength, imageCount }, { ethers }) => {
    
    const descriptorFactory = await ethers.getContractFactory('NounsDescriptorV2', {
        libraries: {
          NFTDescriptorV2: nftDescriptor,
        },
      });
      const descriptorContract = descriptorFactory.attach(nounsDescriptor);
    
    //const receipt = await (await descriptorContract.addGlasses(encodeCompressed,decompressedLength,imageCount)).wait();
    //const receipt = await (await descriptorContract.addAccessories(encodeCompressed,decompressedLength,imageCount)).wait();
    const receipt = await (await descriptorContract.addHeads(encodeCompressed,decompressedLength,imageCount)).wait();

    console.log(`Trait added to art contract.`);
  });
