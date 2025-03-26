import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { extendTheme, ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, } from 'react-router-dom';
import { PostProvider } from './context/PostContext';
import { FollowProvider } from './context/FollowContext';
import { ChatsProvider } from './context/ChatsContext';
import { StoryProvider } from './context/StoryContext';
import { CallProvider } from './context/CallContext';
import store from './redux/store';

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}

const theme = extendTheme({ colors });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <PostProvider>
            <FollowProvider>
              <ChatsProvider>
                <StoryProvider>
                  <CallProvider>
                    <ChakraProvider theme={theme}>
                      <App />
                    </ChakraProvider>
                  </CallProvider>
                </StoryProvider>
              </ChatsProvider>
            </FollowProvider>
          </PostProvider>
        </AuthProvider>
      </Router>
    </Provider>
  </React.StrictMode>
);
