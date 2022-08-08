## Deploying a contract in the blockchain

```ts
const Lock = await ethers.getContractFactory('Lock');
const lock = await Lock.deploy(unlockTime, {
  value: lockedAmount,
});

await contract.deployed();

provider.provider = ethers.getDefaultProvider('kovan');

await lock.deployed();
// public key: 0x874b3fD0b174b5c8CB7EDeeA361860f6F07Cb074
//private key: 0xd2740d47732e2012a6987a94db37f8b733214f884a4ef0312c2d7425df019887

const wallet = ethers.Wallet.createRandom();

console.log('address:', wallet.address);
console.log('mnemonic:', wallet.mnemonic.phrase);
console.log('privateKey:', wallet.privateKey);
const wallet = new ethers.Wallet(
  '0xd2740d47732e2012a6987a94db37f8b733214f884a4ef0312c2d7425df019887',
  provider
);

const seller = await contract.getSeller();
console.log(seller);

const buyer = await contract.getBuyer();

console.log(buyer);

const balance = await wallet.getBalance();

console.log(balance.toString());

console.log('Lock with 1 ETH deployed to:', lock.address);
```

## Connecting to a exisiting contract using ethers in hardhat

```ts
const signer = await ethers.getSigner(
  '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
);

const contract1 = new ethers.Contract(
  '0x94b75aa39bec4cb15e7b9593c315af203b7b847f',
  [
    {
      inputs: [
        {
          internalType: 'address payable',
          name: 'sellerAddress',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'priceOfGoods',
          type: 'uint256',
        },
        {
          internalType: 'uint64',
          name: 'date1',
          type: 'uint64',
        },
        {
          internalType: 'uint64',
          name: 'date2',
          type: 'uint64',
        },
      ],
      stateMutability: 'payable',
      type: 'constructor',
    },
    {
      inputs: [],
      name: 'Unauthorized',
      type: 'error',
    },
    {
      inputs: [],
      name: 'Withdrawed',
      type: 'error',
    },
    {
      inputs: [],
      name: 'getBuyer',
      outputs: [
        {
          internalType: 'address payable',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getEndDate',
      outputs: [
        {
          internalType: 'uint64',
          name: '',
          type: 'uint64',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getPrice',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getSeller',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getStartDate',
      outputs: [
        {
          internalType: 'uint64',
          name: '',
          type: 'uint64',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'withdrawFunds',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
  ],
  signer
);

const seller = await contract1.getSeller();
console.log(seller);
```

## Some more way to create a contract

```ts
const sig = new ethers.Wallet(
  '0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61',
  provider
);

const C2cContract = await ethers.getContractFactory('C2cContract', sig);
```
