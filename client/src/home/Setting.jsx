import React, { useState } from 'react';
import { ChakraProvider, Box, VStack, HStack, Button, Text, useColorModeValue } from '@chakra-ui/react';

const Profile = () => <Text>Profile Content</Text>;
const PrivacySecurity = () => <Text>Privacy & Security Content</Text>;
const Activities = () => <Text>Activities Content</Text>;
const DangerZone = () => <Text>Danger Zone Content</Text>;

const settingsContent = {
  profile: <Profile />,
  privacy: <PrivacySecurity />,
  activities: <Activities />,
  dangerZone: <DangerZone />,
};

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const bgColor = useColorModeValue('gray.300','gray.900');
  return (
    <ChakraProvider>
      <HStack height="100vh" align="start" spacing={0}>
        <VStack
          width="20%"
          height="100vh"
          bg={bgColor}
          p={4}
          spacing={4}
          align="stretch"
          borderRadius={10}
          
        >
          <Button variant="ghost" onClick={() => setActiveSection('profile')}>
            Profile
          </Button>
          <Button variant="ghost" onClick={() => setActiveSection('privacy')}>
            Privacy & Security
          </Button>
          <Button variant="ghost" onClick={() => setActiveSection('activities')}>
            Activities
          </Button>
          <Button variant="ghost" onClick={() => setActiveSection('dangerZone')}>
            Danger Zone
          </Button>
        </VStack>
        <Box width="80%" p={4}>
          {settingsContent[activeSection]}
        </Box>
      </HStack>
    </ChakraProvider>
  );
};

export default SettingsPage;
