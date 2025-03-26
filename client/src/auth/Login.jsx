import React, { useState } from 'react';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  InputRightElement,
  InputGroup,
  Center,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc'
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';


const Login = () => {
  const { user, login, handleInput,wait} = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const handleGoogleLogin = (e) => {
    e.preventDefault();
    window.location.href = `${process.env.REACT_APP_API_HOST}/api/auth/google`; 
  };
  
  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Login in to your account</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
            <Button onClick={handleGoogleLogin} w={'full'} mb={4} variant={'outline'} leftIcon={<FcGoogle />}>
              <Center>
                <Text>Sign in with Google</Text>
              </Center>
            </Button>
          <Stack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email/Username/Mobile</FormLabel>
              <Input
                type="text"
                name='userInput'
                value={user.userInput || ''}
                onChange={handleInput}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={user.password}
                  onChange={handleInput}
                  name="password"
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Checkbox name="rememberMe" checked={user.rememberMe} value={user.rememberMe} onChange={handleInput}>Remember me</Checkbox>
                <Text color={'blue.400'}>
                  <Link to={'/forgot'} color={'blue.400'}>
                    Forgot password?
                  </Link>
                </Text>
              </Stack>
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                isLoading={wait}
                onClick={() => login(user)}>
                Log in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
