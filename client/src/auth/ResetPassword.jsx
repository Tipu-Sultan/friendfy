import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    IconButton,
    InputGroup,
    InputRightElement,
    Heading,
    useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useAuth } from '../context/AuthContext';

export default function ResetPassword() {
    const { resetPassword, wait } = useAuth()
    const [showPassword, setShowPassword] = useState(false);
    const [resetInput, setResetInput] = useState({ otp: '', password: '', cpassword: '', })

    const handleResetInput = (e) => {
        const { name, value } = e.target
        setResetInput((pre) => ({
            ...pre,
            [name]: value
        }))
    }

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} >
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Reset Your Password</Heading>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                        <FormControl id="otp">
                            <FormLabel>One-Time Password (OTP)</FormLabel>
                            <Input placeholder="Enter OTP" type="number" name='otp' value={resetInput.otp} onChange={handleResetInput} />
                        </FormControl>
                        <FormControl id="newPassword">
                            <FormLabel>New Password</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your new password"
                                    name='password' value={resetInput.password} onChange={handleResetInput}
                                />
                                <InputRightElement >
                                    <IconButton
                                        onClick={handleTogglePassword}
                                        icon={showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                    />
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <FormControl id="confirmPassword">
                            <FormLabel>Confirm New Password</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Confirm your new password"
                                    name='cpassword' value={resetInput.cpassword} onChange={handleResetInput}
                                />
                                <InputRightElement>
                                    <IconButton

                                        onClick={handleTogglePassword}
                                        icon={showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                    />
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Stack spacing={10}>
                            <Button
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}
                                isLoading={wait}
                                onClick={() => resetPassword(resetInput)}
                            >
                                Reset Password
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}
