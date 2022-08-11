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

const MyWalletPage: NextPage<IndexProps> = () => {
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
      </Flex>
    </Flex>
  );
};
export default MyWalletPage;
