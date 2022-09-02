import { NextPage } from 'next';
import React, { useEffect } from 'react';

import { Flex, Heading, Input, Button, Text } from '@chakra-ui/react';
import { FormControl, FormLabel, FormHelperText } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import axios from 'axios';

interface IndexProps {}

async function addProduct(data: Record<string, any>): Promise<boolean> {
  const response = await axios.post('/api/addProduct', data);
  return response.data.success;
}

const HomePage: NextPage<IndexProps> = () => {
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
        <Heading mb={6}>List products</Heading>

        <Formik
          initialValues={{ name: '', price: '', startDate: '', endDate: '' }}
          onSubmit={async (value) => {
            console.log(value);
            const phone = window.localStorage.getItem('phone') as string;
            const walletData = JSON.parse(window.localStorage.getItem(phone)!);
            const response = await addProduct({
              seller: walletData.address,
              ...value,
            });

            console.log(response);
          }}
        >
          {() => (
            <Form>
              <Field name='name'>
                {({ field }: any) => (
                  <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input {...field} borderColor={'grey'} />
                  </FormControl>
                )}
              </Field>
              <Field name='price'>
                {({ field }: any) => (
                  <FormControl>
                    <FormLabel>Price</FormLabel>
                    <Input {...field} type='number' borderColor={'grey'} />
                  </FormControl>
                )}
              </Field>
              <Field name='startDate'>
                {({ field }: any) => (
                  <FormControl>
                    <FormLabel>Start Date</FormLabel>
                    <Input {...field} borderColor={'grey'} />
                    <FormHelperText>
                      Enter start date as a YYYY-MM-DD
                    </FormHelperText>
                  </FormControl>
                )}
              </Field>
              <Field name='endDate'>
                {({ field }: any) => (
                  <FormControl>
                    <FormLabel>Price</FormLabel>
                    <Input {...field} borderColor={'grey'} />
                    <FormHelperText>
                      Enter end date as a YYYY-MM-DD
                    </FormHelperText>
                  </FormControl>
                )}
              </Field>
              <Button
                mt={4}
                colorScheme='teal'
                // isLoading={props.isSubmitting}
                type='submit'
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
        <Text mt={6} fontSize='sm'>
          No validation is done, So pls enter all values
        </Text>
      </Flex>
    </Flex>
  );
};

export default HomePage;
