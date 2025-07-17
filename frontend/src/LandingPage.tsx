import React from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Paper
} from '@mui/material'
import {
  AccountBalanceWallet,
  Security,
  VerifiedUser,
  Speed
} from '@mui/icons-material'

interface LandingPageProps {
  onConnect: () => void
  isConnecting?: boolean
}

const LandingPage: React.FC<LandingPageProps> = ({ onConnect, isConnecting = false }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
        color: 'white',
        fontFamily: 'Monaco, monospace',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.9)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  border: '2px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}
              >
                T
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 2 }}>
                TOOURNAMENT
              </Typography>
            </Box>

            <Button
              onClick={onConnect}
              variant="outlined"
              startIcon={<AccountBalanceWallet />}
              disabled={isConnecting}
              sx={{
                color: 'white',
                borderColor: 'white',
                px: 3,
                py: 1,
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'white',
                  color: 'black',
                  borderColor: 'white'
                },
                '&:disabled': {
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'rgba(255,255,255,0.3)'
                }
              }}
            >
              {isConnecting ? 'CONNECTING...' : 'CONNECT WALLET'}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          py: 8 
        }}
      >
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              fontSize: { xs: '3rem', md: '6rem' },
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: 3
            }}
          >
            TOOURNAMENT
          </Typography>
          
          <Typography
            variant="h4"
            sx={{
              mb: 4,
              color: 'rgba(255,255,255,0.8)',
              fontWeight: 300,
              fontSize: { xs: '1.5rem', md: '2.5rem' }
            }}
          >
            Decentralized Quiz Battles
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.6)',
              maxWidth: 600,
              mx: 'auto',
              mb: 6,
              lineHeight: 1.6
            }}
          >
            Join the ultimate blockchain-powered quiz tournament platform. 
            Battle players worldwide, earn USDT prizes, and collect exclusive NFTs!
          </Typography>

          {/* Feature Tags */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 8, flexWrap: 'wrap' }}>
            {['TRUSTLESS', 'VERIFIABLE', 'FAIR', 'DECENTRALIZED'].map((tag) => (
              <Paper
                key={tag}
                sx={{
                  px: 3,
                  py: 1,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 20
                }}
              >
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                  {tag}
                </Typography>
              </Paper>
            ))}
          </Box>

          {/* CTA Button */}
          <Button
            onClick={onConnect}
            variant="contained"
            size="large"
            startIcon={<AccountBalanceWallet />}
            disabled={isConnecting}
            sx={{
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              border: 0,
              borderRadius: 3,
              boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
              color: 'white',
              height: 56,
              px: 4,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 10px 4px rgba(255, 105, 135, .3)'
              },
              '&:disabled': {
                background: 'rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.5)'
              }
            }}
          >
            {isConnecting ? 'CONNECTING...' : 'CONNECT WALLET TO START'}
          </Button>
        </Box>

        {/* Features Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr' }, gap: 4, mt: 8 }}>
          {[
            {
              icon: <Security sx={{ fontSize: 40 }} />,
              title: 'SECURE',
              description: 'Smart contract verified on-chain'
            },
            {
              icon: <VerifiedUser sx={{ fontSize: 40 }} />,
              title: 'TRANSPARENT', 
              description: 'All transactions publicly auditable'
            },
            {
              icon: <Speed sx={{ fontSize: 40 }} />,
              title: 'FAST',
              description: 'Instant payouts via smart contracts'
            },
            {
              icon: <AccountBalanceWallet sx={{ fontSize: 40 }} />,
              title: 'REWARDING',
              description: 'Earn USDT and exclusive NFTs'
            }
          ].map((feature, index) => (
            <Box
              key={index}
              sx={{
                textAlign: 'center',
                p: 3,
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2,
                background: 'rgba(255,255,255,0.02)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.3)',
                  background: 'rgba(255,255,255,0.05)',
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <Box sx={{ color: '#FE6B8B', mb: 2 }}>
                {feature.icon}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: 'white' }}>
                {feature.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                {feature.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          py: 4,
          textAlign: 'center'
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: 1
          }}
        >
          TOOURNAMENT • FULLY DECENTRALIZED • NO BACKEND • ON-CHAIN VERIFIED
        </Typography>
      </Box>
    </Box>
  )
}

export default LandingPage
