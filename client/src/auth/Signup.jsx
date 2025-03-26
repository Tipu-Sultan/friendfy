"use client";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
const API_HOST = process.env.REACT_APP_API_HOST;

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [wait, setWait] = useState()
  const [error, setError] = useState()
  const [check, setCheck] = useState()
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const handleSignup = async () => {
    try {
      setWait(true)
      const response = await axios.post(`${API_HOST}/api/auth/signup`, formData);

      if (response.status === 201) {
        toast.success(response.data.message);
        setWait(false);
      } else if (response.status === 400) {
        toast.success(response.data.error);
        setWait(false);
      } else {
        toast.error("Signup failed");
        setWait(false);
      }
    } catch (error) {
      toast.error(error);
      setWait(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSignup();
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(preValue => ({
      ...preValue,
      [id]: value,
    }));

    if (id === 'password') {
      setCheck(isStrongPassword(value));
      setError(
        'Password must be at least 8 characters long and contain e.g: (@$!%*?&,A-Za-z,0-9)'
      );
    }
  };

  function isStrongPassword(password) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <HStack>
                <Box>
                  <FormControl id="firstname" isRequired>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      type="text"
                      value={formData.firstname}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="lastname">
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      type="text"
                      value={formData.lastname}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="username" isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="phoneNumber" isRequired>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
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
                <Text>{!check && <p style={{ color: 'red' }}>{error || check}</p>}</Text>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  type="submit"
                  size="lg"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  isLoading={wait}
                >
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Already a user?{" "}
                  <Link to={"/login"} color={"blue.400"}>
                    Login
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}
