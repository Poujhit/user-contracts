import { NextPage } from 'next';
import React, { useEffect } from 'react';

import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';

interface IndexProps {}

const HomePage: NextPage<IndexProps> = () => {
  const router = useRouter();

  useEffect(() => {
    if (!window.localStorage.getItem('phone')) {
      router.replace('/');
    }
  }, [router]);

  return (
    <div>
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
          <Heading mb={6}>Home</Heading>

          <Button
            color='white'
            colorScheme='teal'
            bgGradient={'linear(to-r, teal.500, green.500)'}
            mb={6}
            onClick={() => {
              router.push('/list-product');
            }}
          >
            List your product
          </Button>

          <Button
            color='white'
            colorScheme='teal'
            bgGradient={'linear(to-r, teal.500, green.500)'}
            mb={6}
            onClick={() => {
              router.push('/buy-product');
            }}
          >
            Buy a product from the seller
          </Button>

          <Button
            color='white'
            colorScheme='teal'
            mb={6}
            bgGradient={'linear(to-r, teal.500, green.500)'}
            onClick={() => {
              router.push('/see-contracts');
            }}
          >
            See your contracts (my orders)
          </Button>
          <Button
            color='white'
            colorScheme='teal'
            mb={6}
            bgGradient={'linear(to-r, teal.500, green.500)'}
            onClick={() => {
              router.push('/withdraw-money');
            }}
          >
            Withdraw money from contracts
          </Button>

          <Button
            color='white'
            colorScheme='teal'
            mb={6}
            bgGradient={'linear(to-r, teal.500, green.500)'}
            onClick={() => {
              router.push('/my-wallet');
            }}
          >
            My Wallet
          </Button>

          <Button
            color='white'
            colorScheme='teal'
            bgGradient={'linear(to-r, teal.500, green.500)'}
            onClick={() => {
              window.localStorage.removeItem('phone');
              router.replace('/');
            }}
          >
            Logout
          </Button>

          <Text mt={6} fontSize='sm'>
            When you buy a product from the seller, a contract
          </Text>
          <Text fontSize='sm'>will be created.</Text>

          <Text mt={3} fontSize='sm'>
            See all your C2C contracts in the See your contracts
          </Text>
          <Text mt={3} fontSize='sm'>
            You can list your products. This is feature does
          </Text>
          <Text fontSize='sm'>
            not interact with blockchain. Stored in our DB.
          </Text>

          <Text mt={3} fontSize='sm'>
            Sellers can withdraw money from Withdraw money from contracts
          </Text>
          <Text fontSize='sm'>
            When a buyer buys a product, it&apos;s seller can view them here and
            withdraw.
          </Text>
        </Flex>
      </Flex>
    </div>
  );
};
export default HomePage;
