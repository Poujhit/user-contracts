import { NextPage } from 'next';
import React from 'react';

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

interface IndexProps {}

const HomePage: NextPage<IndexProps> = (props) => {
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
        <Heading mb={6}>Home</Heading>

        <Button
          color='white'
          bgGradient={'linear(to-r, teal.500, green.500)'}
          mb={6}
        >
          List your product
        </Button>

        <Button
          color='white'
          bgGradient={'linear(to-r, teal.500, green.500)'}
          mb={6}
        >
          Buy a product from the seller
        </Button>

        <Button color='white' bgGradient={'linear(to-r, teal.500, green.500)'}>
          See your contracts
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
      </Flex>
    </Flex>
  );
};
export default HomePage;
