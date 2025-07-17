import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Button,
  Avatar,
  Chip
} from '@mui/material'
import {
  SportsEsports,
  EmojiEvents,
  AccountBalanceWallet,
  Person,
  ExitToApp
} from '@mui/icons-material'

interface HomePageProps {
  account: string
  onDisconnect: () => void
}

const HomePage: React.FC<HomePageProps> = ({ account, onDisconnect }) => {
  const navigate = useNavigate()

  const handleCardClick = (section: string) => {
    console.log(`Navigating to ${section}`)
    if (section === 'tournament') {
      navigate('/games')
    } else {
      // Navigation for other sections will be implemented later
      alert(`${section} section will be implemented next`)
      console.log(`${section} navigation not implemented yet`)
    }
  }

  const cardData = [
    {
      title: 'SOLO ADVENTURE',
      description: 'Practice your skills and earn rewards in single-player mode',
      icon: <SportsEsports sx={{ fontSize: 40 }} />,
      color: '#FF6B6B',
      action: () => handleCardClick('solo-adventure')
    },
    {
      title: 'TOURNAMENT',
      description: 'Join competitive tournaments and battle other players',
      icon: <EmojiEvents sx={{ fontSize: 40 }} />,
      color: '#4ECDC4',
      action: () => handleCardClick('tournament')
    },
    {
      title: 'VAULT',
      description: 'Manage your NFTs, rewards, and earnings',
      icon: <AccountBalanceWallet sx={{ fontSize: 40 }} />,
      color: '#45B7D1',
      action: () => handleCardClick('vault')
    },
    {
      title: 'PROFILE',
      description: 'View your stats, achievements, and tournament history',
      icon: <Person sx={{ fontSize: 40 }} />,
      color: '#96CEB4',
      action: () => handleCardClick('profile')
    }
  ]

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
        color: 'white',
        fontFamily: 'Monaco, monospace'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.9)',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 1000
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

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                avatar={<Avatar sx={{ bgcolor: 'green', width: 16, height: 16 }} />}
                label={`${account.slice(0, 6)}...${account.slice(-4)}`}
                variant="outlined"
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
              />
              <Button
                onClick={onDisconnect}
                startIcon={<ExitToApp />}
                variant="outlined"
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                DISCONNECT
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Welcome Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            WELCOME BACK
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.7)',
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Choose your path in the decentralized tournament ecosystem
          </Typography>
        </Box>

        {/* 4-Card Grid */}
        <Grid container spacing={4}>
          {cardData.map((card, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 6 }} key={card.title}>
              <Card
                sx={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    borderColor: card.color,
                    boxShadow: `0 20px 40px rgba(${card.color.slice(1)}, 0.3)`,
                    background: 'rgba(255,255,255,0.05)'
                  }
                }}
              >
                <CardActionArea onClick={card.action} sx={{ p: 0 }}>
                  <CardContent sx={{ p: 4, textAlign: 'center', minHeight: 250 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 3,
                        color: card.color
                      }}
                    >
                      {card.icon}
                    </Box>
                    
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 'bold',
                        mb: 2,
                        color: 'white',
                        letterSpacing: 1
                      }}
                    >
                      {card.title}
                    </Typography>
                    
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'rgba(255,255,255,0.7)',
                        lineHeight: 1.6,
                        fontSize: '0.95rem'
                      }}
                    >
                      {card.description}
                    </Typography>
                    
                    <Box
                      sx={{
                        mt: 3,
                        pt: 2,
                        borderTop: `1px solid ${card.color}`,
                        opacity: 0.8
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: card.color,
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          letterSpacing: 1
                        }}
                      >
                        Click to Enter
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Stats Section */}
        <Box sx={{ mt: 10, textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              mb: 6,
              color: 'white'
            }}
          >
            PLATFORM STATS
          </Typography>
          
          <Grid container spacing={4}>
            {[
              { label: 'TOTAL BATTLES', value: '1,247' },
              { label: 'USDT DISTRIBUTED', value: '52,340' },
              { label: 'ACTIVE PLAYERS', value: '891' },
              { label: 'NFTS MINTED', value: '156' }
            ].map((stat, index) => (
              <Grid size={{ xs: 6, md: 3 }} key={stat.label}>
                <Box
                  sx={{
                    p: 3,
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.02)'
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 'bold',
                      mb: 1,
                      color: 'white',
                      fontFamily: 'Monaco, monospace'
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255,255,255,0.6)',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      fontSize: '0.75rem'
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          py: 4,
          mt: 8,
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

export default HomePage
