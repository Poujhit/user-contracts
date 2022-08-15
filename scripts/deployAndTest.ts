import { ethers } from 'hardhat';

async function main() {
  let provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');

  //buyer: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
  //seller: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8

  // adding signer so that msg.sender is the buyer, that is the making contract creator as buyer.
  const signer = await ethers.getSigner(
    '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'
  );

  const C2cContract = await ethers.getContractFactory('C2cContract', signer);

  const amount = ethers.utils.parseEther('1');

  const contract = await C2cContract.deploy(
    '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    amount,
    Math.floor(new Date().getTime() / 1000),
    Math.floor(new Date('2022.12.01').getTime() / 1000),
    { value: amount }
  );

  await contract.deployed();

  const buyer = await contract.getBuyer();

  console.log(buyer);

  // const endDate = await contract.getEndDate();
  // console.log(parseInt(endDate.toString()));

  // var date = new Date(parseInt(endDate.toString()));
  // var hours = date.getHours();
  // var minutes = '0' + date.getMinutes();
  // var seconds = '0' + date.getSeconds();

  // var formattedTime =
  //   hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

  // console.log(formattedTime);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
