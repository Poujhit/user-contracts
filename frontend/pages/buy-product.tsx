import { NextPage } from 'next';
import React, { useEffect } from 'react';

import { useState } from 'react';

import {
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { ethers } from 'ethers';
import { contractDetails } from 'utils/contract';

interface IndexProps {}

const BuyProduct: NextPage<IndexProps> = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const response = await axios.get('/api/getProducts');
      setData(response.data?.data ?? []);
      setLoading(false);
    }
    getData();
  }, []);

  return (
    <Flex alignItems='center' justifyContent='start' direction='column'>
      <Heading mb={6} position='fixed'>
        Buy products (Create a contract)
      </Heading>
      {loading ? (
        <Text mt={40}>Loading...</Text>
      ) : (
        data.map((prod: Record<string, any>, index) => (
          <Flex
            key={index}
            direction='column'
            background='gray.100'
            p={12}
            mt={16}
            width={'80%'}
            rounded={6}
            alignItems='center'
            justifyContent={'center'}
          >
            <p>{JSON.stringify(prod)}</p>
            <Button
              color='white'
              colorScheme='teal'
              mt={6}
              bgGradient={'linear(to-r, teal.500, green.500)'}
              onClick={async () => {
                const phone = localStorage.getItem('phone')!;
                const walletData = JSON.parse(
                  localStorage.getItem(phone)!
                ) as Record<string, any>;

                if (prod.seller === walletData.address) {
                  return;
                }

                const provider = ethers.getDefaultProvider('goerli');
                const account = new ethers.Wallet(
                  walletData.privateKey,
                  provider
                );

                const contract = new ethers.ContractFactory(
                  contractDetails.abi,
                  contractDetails.bytecode,
                  account
                );

                const deployedContract = await contract.deploy(
                  prod.seller,
                  ethers.utils.parseEther(prod.price.toString()),
                  Math.floor(new Date(prod.startDate).getTime() / 1000),
                  Math.floor(new Date(prod.endDate).getTime() / 1000),
                  ethers.utils.formatBytes32String(prod.name),
                  { value: ethers.utils.parseEther(prod.price.toString()) }
                );

                console.log(deployedContract.address);

                const response = await axios.post('/api/buyProduct', {
                  phone: phone,
                  contractAddress: deployedContract.address,
                });
                console.log(response);

                const response1 = await axios.post('/api/addToWithdraw', {
                  phone: prod.sellerPhone,
                  contractAddress: deployedContract.address,
                });
                console.log(response1);

                console.log('done!!');
              }}
            >
              Buy
            </Button>
          </Flex>
        ))
      )}
    </Flex>
  );
};
export default BuyProduct;
