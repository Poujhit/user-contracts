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
          Create a C2C contract as seller
        </Button>

        <Button
          color='white'
          bgGradient={'linear(to-r, teal.500, green.500)'}
          mb={6}
        >
          Create a C2C contract as buyer
        </Button>

        <Button color='white' bgGradient={'linear(to-r, teal.500, green.500)'}>
          See your contracts
        </Button>

        <Text mt={6} fontSize='sm'>
          You can create a contract as a seller and a buyer
        </Text>

        <Text mt={3} fontSize='sm'>
          See all your C2C contracts in the See your contracts
        </Text>
        <Text fontSize='sm'>Both the buyer and seller contract is there.</Text>
      </Flex>
    </Flex>
  );
};
export default HomePage;
