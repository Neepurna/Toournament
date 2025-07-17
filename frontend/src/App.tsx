import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import LandingPage from './LandingPage'
import HomePage from './HomePage'
import SelectGames from './SelectGames'
import UltimateQuiz from './UltimateQuiz'
import PracticeQuiz from './PracticeQuiz'
import QuizRoyale from './QuizRoyale'

// Dark theme configuration for Material UI
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#888888',
    },
    background: {
      default: '#000000',
      paper: '#111111',
    },
    text: {
      primary: '#ffffff',
      secondary: '#888888',
    },
  },
  typography: {
    fontFamily: '"Roboto Mono", "Monaco", "Menlo", "Ubuntu Mono", monospace',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '1px solid',
          '&:hover': {
            backgroundColor: '#ffffff',
            color: '#000000',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          '&:hover': {
            border: '1px solid rgba(255, 255, 255, 0.4)',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
  },
})

// Mock Web3 functionality for MVP testing
declare global {
  interface Window {
    ethereum?: any;
  }
}

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setIsConnecting(true);
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAccount(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        alert('Failed to connect wallet. Please try again.');
      } finally {
        setIsConnecting(false);
      }
    } else {
      alert('MetaMask not detected. Please install MetaMask.');
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setIsConnected(false);
  };

  // Show landing page if not connected, home page if connected
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        {!isConnected ? (
          <LandingPage 
            onConnect={connectWallet}
            isConnecting={isConnecting}
          />
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={
              <HomePage 
                account={account}
                onDisconnect={disconnectWallet}
              />
            } />
            <Route path="/games" element={<SelectGames />} />
            <Route path="/ultimate-quiz" element={<UltimateQuiz />} />
            <Route path="/practice-quiz" element={<PracticeQuiz />} />
            <Route path="/quiz-royale" element={<QuizRoyale />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;
