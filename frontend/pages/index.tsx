import { useState } from 'react';

import type { NextPage } from 'next';

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
import { useRouter } from 'next/router';

async function callAddUser(phone: string) {
  const response = await axios.post('/api/addUser', { phone });
  console.log(response.data);
}

async function isUserExists(phone: string): Promise<boolean> {
  const response = await axios.post('/api/checkUserExists', { phone });
  return response.data.userExists;
}

const Home: NextPage = () => {
  const [phone, setPhone] = useState('');
  const router = useRouter();
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
        <Heading mb={6}>Login</Heading>

        <InputGroup mb={6}>
          <InputLeftAddon>
            <div>+91</div>
          </InputLeftAddon>
          <Input
            type='number'
            variant='outlined'
            placeholder='Phone number'
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
            }}
          />
        </InputGroup>
        <Button
          colorScheme='teal'
          onClick={async () => {
            if (!(await isUserExists(phone))) {
              await callAddUser(phone);
              const wallet = ethers.Wallet.createRandom();
              window.localStorage.setItem(
                'wallet',
                JSON.stringify({
                  publickey: wallet.publicKey,
                  privateKey: wallet.privateKey,
                  address: wallet.address,
                  mnemonic: wallet.mnemonic.phrase,
                })
              );
            }

            router.replace('/home');
          }}
        >
          Log in
        </Button>

        <Text mt={6} fontSize='sm'>
          A new account and a ethereum wallet will be created if
        </Text>
        <Text mb={2} fontSize='sm'>
          the phone number is not already there in our database.
        </Text>
        <Text mb={0} fontSize='sm'>
          Your ethereum wallet credentials are stored in your browser
        </Text>
        <Text mb={0} fontSize='sm'>
          localstorage. If deleted then gone. No way to recover.
        </Text>
      </Flex>
    </Flex>
  );
};

export default Home;
