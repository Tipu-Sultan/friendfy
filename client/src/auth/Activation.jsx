import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Flex, Box, Text, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Activation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const HOST = process.env.REACT_APP_API_HOST

  useEffect(() => {
    const activateUser = async () => {
      try {
        const response = await axios.put(`${HOST}/api/auth/activate-user/${token}`);
        setTimeout(() => {
          navigate('/login')
          toast.success(response.data.message);
        }, 7000);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    activateUser();
  }, [token, navigate, HOST]);

  return (
    <Flex
      align="center"
      justify="center"
      height="100vh"
      flexDirection="column"
      textAlign="center"
    >
      <Box p={4}>
        <Text fontSize="lg">Activating your account...</Text>
        <Text mt={4}>Please wait while we activate your account.</Text>
        <Spinner mt={4} size="lg" color="teal" />
      </Box>
    </Flex>

  );
};

export default Activation;
