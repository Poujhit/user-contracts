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

interface IndexProps {}

const BuyProduct: NextPage<IndexProps> = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

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
    <Flex alignItems='center' justifyContent='start' direction='column'>
      <Heading mb={6} position='fixed'>
        Buy products (Create a contract)
      </Heading>
      {loading ? (
        <Text mt={40}>Loading...</Text>
      ) : (
        data.map((prod, index) => (
          <Flex
            key={index}
            direction='column'
            background='gray.100'
            p={12}
            mt={16}
            rounded={6}
            alignItems='center'
          >
            <pre>{JSON.stringify(prod)}</pre>
            <Button
              color='white'
              colorScheme='teal'
              mt={6}
              bgGradient={'linear(to-r, teal.500, green.500)'}
              onClick={() => {
                // router.push('/see-contracts');
              }}
            >
              Buy
            </Button>
          </Flex>
        ))
      )}
    </Flex>
  );
};
export default BuyProduct;
