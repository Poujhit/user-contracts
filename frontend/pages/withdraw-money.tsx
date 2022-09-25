import { NextPage } from 'next';
import React, { useCallback, useEffect } from 'react';

import { useState } from 'react';

import { Button, Flex, Heading, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { ethers } from 'ethers';
import { contractDetails } from 'utils/contract';
import { provider } from 'utils/provider';
import LoadingOverlayWrapper from 'react-loading-overlay-ts';

interface IndexProps {}

const WithdrawMoney: NextPage<IndexProps> = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadedContract, setLoadedContract] = useState<ethers.Contract>();
  const [blockchainData, setBlockchainData] = useState<Record<string, any>[]>(
    []
  );
  const toast = useToast();
  const [isActive, setActive] = useState(false);
  const handleButtonClicked = useCallback(() => {
    setActive((value) => !value);
  }, []);

  const [account, setAccount] = useState<ethers.Wallet>();
  useEffect(() => {
    async function getData() {
      setLoading(true);
      const response = (
        await axios.post('/api/getMyWithdraw', {
          phone: window.localStorage.getItem('phone'),
        })
      ).data.orders;

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
    <LoadingOverlayWrapper active={isActive} spinner text='Loading...'>
      <Flex
        alignItems='center'
        justifyContent='start'
        direction='column'
        height={'100vh'}
      >
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
                onClick={async () => {
                  handleButtonClicked();
                  await loadedContract?.withdrawFunds();
                  handleButtonClicked();
                  toast({
                    title: 'Done',
                  });

                  window.location.reload();
                }}
              >
                Withdraw
              </Button>
              <Button
                color='white'
                colorScheme='teal'
                mt={6}
                bgGradient={'linear(to-r, teal.500, green.500)'}
                onClick={async () => {
                  handleButtonClicked();
                  const contract = new ethers.Contract(
                    value['contractAddress'],
                    contractDetails.abi,
                    account
                  );
                  setLoadedContract(contract);
                  let contractData: Record<string, any> = {};
                  contractData['buyer'] = await contract.getBuyer();
                  contractData['seller'] = await contract.getSeller();
                  contractData['isWithdrawed'] =
                    await contract.isFundsWithdrawed();
                  contractData['prodName'] = ethers.utils.parseBytes32String(
                    await contract.getProdName()
                  );

                  contractData['endDate'] = new Date(
                    parseInt(await contract.getEndDate()) * 1000
                  ).toUTCString();

                  contractData['startDate'] = new Date(
                    parseInt(await contract.getStartDate()) * 1000
                  ).toUTCString();

                  contractData['price'] = `${ethers.utils.formatEther(
                    await contract.getPrice()
                  )} ethers`;

                  const updatingValue = [...blockchainData];
                  updatingValue.splice(index, 0, contractData);

                  setBlockchainData(updatingValue);
                  handleButtonClicked();
                }}
              >
                Get contract data from blockchain
              </Button>
            </Flex>
          ))
        )}
      </Flex>
    </LoadingOverlayWrapper>
  );
};
export default WithdrawMoney;
