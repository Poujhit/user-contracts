import { ethers } from 'ethers';

export const provider = ethers.getDefaultProvider('goerli', {
  etherscan: process.env.NEXT_PUBLIC_ETHERSCAN_API,
});
