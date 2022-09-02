import { NextPage } from 'next';
import React, { useEffect } from 'react';

import { useState } from 'react';
import { ethers } from 'ethers';

import {
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
} from '@chakra-ui/react';

function truncate(str: string, maxDecimalDigits: number) {
  if (str.includes('.')) {
    const parts = str.split('.');
    return parts[0] + '.' + parts[1].slice(0, maxDecimalDigits);
  }
  return str;
}

interface IndexProps {}

const MyWalletPage: NextPage<IndexProps> = () => {
  const [walletData, setWalletData] = useState<Record<string, string>>({});
  console.log(walletData);

  useEffect(() => {
    async function getWalletData() {
      const phone: string = window.localStorage.getItem('phone')!;
      let data = window.localStorage.getItem(phone) as any;
      data = JSON.parse(data);
      console.log(data);
      const provider = ethers.getDefaultProvider('kovan');
      const walletWithProvider = new ethers.Wallet(data.privateKey, provider);
      const balance = await walletWithProvider.getBalance();
      setWalletData({
        address: walletWithProvider.address,
        balance: balance.toString(),
      });
    }

    getWalletData();
  }, []);

  return (
    <Flex
      height='100vh'
      alignItems='center'
      justifyContent='center'
      direction='column'
    >
      <Flex
        direction='column'
        background='gray.100'
        p={12}
        rounded={6}
        alignItems='center'
      >
        <Heading mb={6}>My Wallet</Heading>

        <Text>
          {' '}
          Address: {walletData?.address
            ? walletData?.address
            : 'Loading....'}{' '}
        </Text>
        <Text mt={3}>
          {' '}
          Balance:{' '}
          {walletData?.balance
            ? truncate(ethers.utils.formatEther(walletData?.balance), 4)
            : 'Loading....'}
        </Text>
      </Flex>
    </Flex>
  );
};
export default MyWalletPage;
