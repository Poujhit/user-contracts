import { ethers } from 'hardhat';

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  const lockedAmount = ethers.utils.parseEther('1');

  const Lock = await ethers.getContractFactory('Lock');
  const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  let provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  // let provider = ethers.getDefaultProvider('kovan')

  await lock.deployed();
  // public key: 0x874b3fD0b174b5c8CB7EDeeA361860f6F07Cb074
  //private key: 0xd2740d47732e2012a6987a94db37f8b733214f884a4ef0312c2d7425df019887

  // const wallet = ethers.Wallet.createRandom();

  // console.log('address:', wallet.address);
  // console.log('mnemonic:', wallet.mnemonic.phrase);
  // console.log('privateKey:', wallet.privateKey);
  const wallet = new ethers.Wallet(
    '0xd2740d47732e2012a6987a94db37f8b733214f884a4ef0312c2d7425df019887',
    provider
  );

  const balance = await wallet.getBalance();

  console.log(balance.toString());

  console.log('Lock with 1 ETH deployed to:', lock.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
