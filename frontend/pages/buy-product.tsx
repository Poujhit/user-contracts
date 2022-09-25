import { NextPage } from 'next';
import React, { useCallback, useEffect } from 'react';

import { useState } from 'react';

import { Button, Flex, Heading, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { ethers } from 'ethers';
import { contractDetails } from 'utils/contract';
import { provider } from 'utils/provider';
import LoadingOverlay from 'react-loading-overlay-ts';

interface IndexProps {}

const BuyProduct: NextPage<IndexProps> = () => {
  const [data, setData] = useState([]);
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [isActive, setActive] = useState(false);
  const handleButtonClicked = useCallback(() => {
    setActive((value) => !value);
  }, []);

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
    <LoadingOverlay active={isActive} spinner text='Loading...'>
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
                  handleButtonClicked();
                  const phone = localStorage.getItem('phone')!;
                  const walletData = JSON.parse(
                    localStorage.getItem(phone)!
                  ) as Record<string, any>;

                  if (prod.seller === walletData.address) {
                    toast({
                      title: 'Error',
                      description: 'You cannot buy from yourself.',
                      status: 'error',
                      duration: 2000,
                    });
                    return;
                  }

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
                  handleButtonClicked();
                  toast({ status: 'success', title: 'Done' });
                }}
              >
                Buy
              </Button>
            </Flex>
          ))
        )}
      </Flex>
    </LoadingOverlay>
  );
};
export default BuyProduct;
