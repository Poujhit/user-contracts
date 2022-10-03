import { NextPage } from 'next';
import React, { useCallback, useEffect } from 'react';

import { useState } from 'react';

import { Button, Flex, Heading, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { ethers } from 'ethers';
import { contractDetails } from 'utils/contract';
import { provider } from 'utils/provider';
import { useRouter } from 'next/router';
import LoadingOverlayWrapper from 'react-loading-overlay-ts';

interface IndexProps {}

const SeeContracts: NextPage<IndexProps> = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!window.localStorage.getItem('phone')) {
      router.replace('/');
    }
  }, [router]);

  const [account, setAccount] = useState<ethers.Wallet>();
  useEffect(() => {
    async function getData() {
      setLoading(true);
      const response = (
        await axios.post('/api/getMyOrders', {
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

  const [isActive, setActive] = useState(false);
  const handleButtonClicked = useCallback(() => {
    setActive((value) => !value);
  }, []);

  return (
    <LoadingOverlayWrapper active={isActive} spinner text='Loading...'>
      <Flex alignItems='center' justifyContent='start' direction='column'>
        <Heading mb={6} position='fixed'>
          See my contracts(orders)
        </Heading>
        {loading ? (
          <Text mt={40}>Loading...</Text>
        ) : data.length === 0 ? (
          <p style={{ marginTop: '140px' }}>No orders</p>
        ) : (
          data.map((value: Record<string, any>, index) => (
            <SeeContractsCard
              value={value}
              key={index}
              account={account}
              handleButtonClicked={handleButtonClicked}
            />
          ))
        )}
      </Flex>
    </LoadingOverlayWrapper>
  );
};

const SeeContractsCard: React.FC<any> = ({
  value,
  account,
  handleButtonClicked,
}) => {
  const [blockchainData, setBlockchainData] = useState<Record<string, any>>({});
  const toast = useToast();
  return (
    <Flex
      direction='column'
      background='gray.100'
      p={12}
      mt={16}
      width={'80%'}
      rounded={6}
      alignItems='center'
      justifyContent={'center'}
    >
      <p>Data from backend: {JSON.stringify(value)}</p>
      <p style={{ width: '90%' }}>
        Contract data from blockchain: {JSON.stringify(blockchainData ?? {})}
      </p>

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
          console.log(contract.address);
          let contractData: Record<string, any> = {};
          contractData['buyer'] = await contract.getBuyer();
          contractData['seller'] = await contract.getSeller();
          contractData['isWithdrawed'] = await contract.isFundsWithdrawed();
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

          console.log(contractData);
          setBlockchainData(contractData);
          handleButtonClicked();
          toast({
            title: 'Done',
          });
        }}
      >
        Get contract data from blockchain
      </Button>
    </Flex>
  );
};

export default SeeContracts;
