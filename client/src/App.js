import React, { useEffect, useState } from "react";
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Image,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiStar,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiUser,
  FiSettings,
} from "react-icons/fi";
import { useColorMode } from "@chakra-ui/react";
import { ChatIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import logo from "./assets/peopulse.png";
import {
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Footer from "./navbar/Footer";
import Chats from "./chatbox/Chats";
import Follow from "./follow/Follow";
import Request from "./follow/Request";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Forgot from "./auth/Forgot";
import Home from "./home/Home";
import Profile from "./home/Profile";
import { FaUserFriends } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./context/AuthContext";
import ResetPassword from "./auth/ResetPassword";
import Activation from "./auth/Activation";
import SearchBar from "./services/SearchBar";
import PageNotFound from "./services/PageNotFound";
import Reels from "./home/Reels";
import Setting from "./home/Setting";
import { useChats } from "./context/ChatsContext";


const LinkItems = (isUser) => {
  if (isUser) {
    return [
      { name: "Home", icon: FiHome, link: "/", },
      { name: "Reels", icon: FiTrendingUp, link: "/reels" },
      { name: "Add Friends", icon: FaUserFriends, link: "/add-friends" },
      { name: "Friends", icon: FaUserFriends, link: "/friends" },
      { name: "Favourites", icon: FiStar, link: "/favourites" },
      { name: "Settings", icon: FiSettings, link: "/settings" },
    ];
  } else {
    return [
      { name: "Login", icon: FiUser, link: "/login" },
      { name: "Signup", icon: FiUser, link: "/signup" },
    ];
  }
};

const SidebarContent = ({ onClose, logout, isUser, ...rest }) => {
  const linksToShow = LinkItems(isUser);

  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Image w={200} src={logo} alt={logo} />
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {linksToShow.map((linkItem) => (
        <NavItem key={linkItem.name} icon={linkItem.icon} link={linkItem.link} onClose={onClose}>
          {linkItem.name}
        </NavItem>
      ))}

      {isUser &&
        <NavItem icon={FiUser} link="#" onClick={logout}>
          Logout
        </NavItem>}

    </Box>
  );
};

const NavItem = ({ icon, children, link, onClose, ...rest }) => {
  const location = useLocation();
  const isActive = location.pathname === link;

  return (
    <Link to={link} onClick={onClose}>
      <Flex
        as="div"
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? "cyan.400" : "transparent"}
        color={isActive ? "white" : "inherit"}
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && <Icon mr="4" fontSize="16" as={icon} />}
        {children}
      </Flex>
    </Link>
  );
};

const MobileNav = ({ onOpen, logout, isUser, ...rest }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const {getUnreadMsgCount} = useChats()
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <SearchBar />
      <HStack spacing={{ base: "0", md: "6" }} ml={2}>
        {isUser&&
          <IconButton
          aria-label="Toggle color mode"
          icon={
            <>
          <ChatIcon />
          {getUnreadMsgCount() > 0 && (
            <Box
              position="absolute"
              top="-1"
              right="-1"
              rounded="full"
              bg="red.500"
              color="white"
              fontSize="xs"
              px="2"
              py="1"
            >
             {getUnreadMsgCount()}
            </Box>
          )}
          </>
        }
          as={Link}
          to={'/chat'}
        />
        }
        <IconButton
          aria-label="Toggle color mode"
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
        />
        <Menu>
        <MenuButton
          as={IconButton}
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={
            <>
              <FiBell />
            </>
          }
        />
        
      </Menu>

        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              {isUser &&
                <HStack>
                  <Avatar
                    size={"sm"}
                    name='Dan Abrahmov' src={`${isUser.profileImage}` ||'https://bit.ly/dan-abramov'}
                  />
                  <VStack
                    display={{ base: "none", md: "flex" }}
                    alignItems="flex-start"
                    spacing="1px"
                    ml="2"
                  >
                    <Text fontSize="sm">{isUser && isUser.firstname}</Text>
                    <Text fontSize="xs" color="gray.600">
                      {isUser ? "LoggedIn" : "Not logged in"}
                    </Text>
                  </VStack>
                  <Box display={{ base: "none", md: "flex" }}>
                    <FiChevronDown />
                  </Box>
                </HStack>
              }
            </MenuButton>
            {isUser && (
              <>
                <MenuList
                >
                  <MenuItem as={Link} to={`/profile/${isUser.username}`}>
                    Profile
                  </MenuItem>
                  <MenuItem as={Link} to={'/forgot'}>Change Password</MenuItem>
                  <MenuItem onClick={logout}>Log out</MenuItem>
                </MenuList>
              </>
            )}
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

const SidebarWithHeader = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { logout, isUser } = useAuth();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      // Store token in localStorage or session storage
      localStorage.setItem('token', token);
      // Redirect or navigate to dashboard
      window.location.href = '/'; // Replace with your dashboard route
    }
  }, []);
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <ToastContainer />
      <SidebarContent
        onClose={onClose}
        display={{ base: "none", md: "block" }}
        logout={logout}
        isUser={isUser}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        size="full"
      >
        <DrawerContent>
          <SidebarContent logout={logout} isUser={isUser} onClose={onClose} />
        </DrawerContent>
      </Drawer>

      <MobileNav onOpen={onOpen} logout={logout}
        isUser={isUser} />
      <Box ml={{ base: 0, md: 60 }} p="2" >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/activation/:token" element={<Activation />} />

          {isUser ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/reels" element={<Reels />} />
              <Route path="/chat" element={<Chats />} />
              <Route path="/chat/:SelectedUsername" element={<Chats />} />

              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/add-friends" element={<Follow />} />
              <Route path="/friends" element={<Request />} />
              <Route path="/settings" element={<Setting />} />

            </>
          ) : (
            <Route path="/" element={<Login />} />
          )}
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </Box>
    </Box>
  );
};

export default SidebarWithHeader;
