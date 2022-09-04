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

const WithdrawMoney: NextPage<IndexProps> = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [blockchainData, setBlockchainData] = useState<Record<string, any>[]>(
    []
  );
  const [account, setAccount] = useState<ethers.Wallet>();
  useEffect(() => {
    async function getData() {
      setLoading(true);
      const response = (
        await axios.post('/api/getMyWithdraw', {
          phone: window.localStorage.getItem('phone'),
        })
      ).data.orders;
      const provider = ethers.getDefaultProvider('goerli');
      const account = new ethers.Wallet(
        JSON.parse(
          window.localStorage.getItem(window.localStorage.getItem('phone')!)!
        ).privateKey,
        provider
      );
      setAccount(account);
      setData(response);
      setLoading(false);
    }

    getData();
  }, []);

  return (
    <Flex alignItems='center' justifyContent='start' direction='column'>
      <Heading mb={6} position='fixed'>
        Withdraw Money
      </Heading>
      {loading ? (
        <Text mt={40}>Loading...</Text>
      ) : (
        data.map((value: Record<string, any>, index) => (
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
            <p>
              Click on get contract data button to check whether you can
              withdraw or not.
            </p>
            <p>Data from backend: {JSON.stringify(value)}</p>
            <p style={{ width: '90%' }}>
              Contract data from blockchain:{' '}
              {JSON.stringify(blockchainData[index] ?? {})}
            </p>
            <Button
              color='white'
              colorScheme='teal'
              mt={6}
              disabled={blockchainData[index]?.isWithdrawed ?? true}
              bgGradient={'linear(to-r, teal.500, green.500)'}
              onClick={async () => {}}
            >
              Withdraw
            </Button>
            <Button
              color='white'
              colorScheme='teal'
              mt={6}
              bgGradient={'linear(to-r, teal.500, green.500)'}
              onClick={async () => {
                const contract = new ethers.Contract(
                  value['contractAddress'],
                  contractDetails.abi,
                  account
                );
                let contractData: Record<string, any> = {};
                contractData['buyer'] = await contract.getBuyer();
                contractData['seller'] = await contract.getSeller();
                contractData['isWithdrawed'] =
                  await contract.isFundsWithdrawed();
                contractData['prodName'] = ethers.utils.parseBytes32String(
                  await contract.getProdName()
                );

                contractData['endDate'] = new Date(
                  parseInt(await contract.getEndDate())
                ).toUTCString();

                contractData['startDate'] = new Date(
                  parseInt(await contract.getStartDate())
                ).toUTCString();

                contractData['price'] = `${ethers.utils.formatEther(
                  await contract.getPrice()
                )} ethers`;

                const updatingValue = [...blockchainData];
                updatingValue.splice(index, 0, contractData);

                setBlockchainData(updatingValue);
              }}
            >
              Get contract data from blockchain
            </Button>
          </Flex>
        ))
      )}
    </Flex>
  );
};
export default WithdrawMoney;
