import { useState } from 'react';

import type { NextPage } from 'next';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import React from 'react';
import { Formik, Form, Field } from 'formik';

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<any>();
  const toast = useToast();

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
                phone,
                JSON.stringify({
                  publickey: wallet.publicKey,
                  privateKey: wallet.privateKey,
                  address: wallet.address,
                  mnemonic: wallet.mnemonic.phrase,
                })
              );
            }
            if (window.localStorage.getItem(phone)) {
              window.localStorage.setItem('phone', phone);
              router.replace('/home');
            } else {
              toast({
                title: 'No wallet found',
                description:
                  'This phone number is registered with our service but the wallet is not found in this broweser. Import the wallet to use your account',
                status: 'error',
                duration: 9000,
                isClosable: true,
              });
            }
          }}
        >
          Log in
        </Button>

        <Button m={3} colorScheme='teal' onClick={onOpen}>
          Import wallet
        </Button>

        <Text mt={6} fontSize='sm'>
          A new account and a ethereum wallet will be created if
        </Text>
        <Text mb={2} fontSize='sm'>
          the phone number is not already there in our database.
        </Text>

        <Text mt={0} fontSize='sm'>
          You can import your wallet if it was already registered
        </Text>
        <Text mb={0} fontSize='sm'>
          in another device. Coz automatically your wallet from one
        </Text>
        <Text mb={0} fontSize='sm'>
          device can&apos;t be saved here because your wallet is not
        </Text>
        <Text mb={1} fontSize='sm'>
          stored in our servers/db
        </Text>
        <Text mb={0} fontSize='sm'>
          Your ethereum wallet credentials are stored in your browser
        </Text>
        <Text mb={0} fontSize='sm'>
          localstorage. If deleted then gone. No way to recover.
        </Text>
      </Flex>
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <Formik
            initialValues={{
              phone: '',
              publickey: '',
              privateKey: '',
              address: '',
              mnemonic: '',
            }}
            onSubmit={async ({ phone, ...otherValues }) => {
              window.localStorage.setItem(phone, JSON.stringify(otherValues));
              onClose();
              toast({
                title: 'Done',
                description: 'Wallet imported successfully!',
                status: 'success',
                duration: 3000,
                isClosable: true,
              });
            }}
          >
            {({ handleSubmit }) => (
              <>
                <AlertDialogHeader>Import Wallet</AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>
                  <Form>
                    <Field name='phone'>
                      {({ field }: any) => (
                        <FormControl>
                          <FormLabel>Phone Number</FormLabel>
                          <Input
                            {...field}
                            borderColor={'grey'}
                            type='number'
                          />
                        </FormControl>
                      )}
                    </Field>
                    <Field name='publicKey'>
                      {({ field }: any) => (
                        <FormControl>
                          <FormLabel>Public Key</FormLabel>
                          <Input {...field} borderColor={'grey'} />
                        </FormControl>
                      )}
                    </Field>
                    <Field name='privateKey'>
                      {({ field }: any) => (
                        <FormControl>
                          <FormLabel>Private Key</FormLabel>
                          <Input {...field} borderColor={'grey'} />
                        </FormControl>
                      )}
                    </Field>
                    <Field name='address'>
                      {({ field }: any) => (
                        <FormControl>
                          <FormLabel>Wallet address</FormLabel>
                          <Input {...field} borderColor={'grey'} />
                        </FormControl>
                      )}
                    </Field>
                    <Field name='mnemonic'>
                      {({ field }: any) => (
                        <FormControl>
                          <FormLabel>Mnemonic</FormLabel>
                          <Input {...field} borderColor={'grey'} />
                        </FormControl>
                      )}
                    </Field>
                  </Form>
                  <Text>
                    No validation is done, so pls enter correct value for the
                    app to work properly
                  </Text>
                  <Text>If no public key available, skip the field.</Text>
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button colorScheme='red' ref={cancelRef} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    ref={cancelRef}
                    ml={3}
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    Import
                  </Button>
                </AlertDialogFooter>
              </>
            )}
          </Formik>
        </AlertDialogContent>
      </AlertDialog>
    </Flex>
  );
};

export default Home;
