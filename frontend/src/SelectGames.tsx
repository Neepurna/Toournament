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
  Chip,
  IconButton
} from '@mui/material'
import {
  ArrowBack,
  Quiz,
  DirectionsRun,
  SportsKabaddi,
  PlayArrow
} from '@mui/icons-material'

const SelectGames: React.FC = () => {
  const navigate = useNavigate()

  const handleGameClick = (gameId: string) => {
    if (gameId === 'ultimate-quiz') {
      navigate('/ultimate-quiz')
    } else {
      console.log(`${gameId} is coming soon`)
    }
  }

  const gameData = [
    {
      id: 'ultimate-quiz',
      title: 'THE ULTIMATE QUIZ',
      description: 'Test your knowledge across multiple categories in this fast-paced quiz tournament',
      icon: <Quiz sx={{ fontSize: 48 }} />,
      color: '#FF6B6B',
      available: true,
      features: ['Multiple Categories', 'Real-time Scoring', 'Leaderboards', 'NFT Rewards']
    },
    {
      id: 'amazing-race',
      title: 'THE AMAZING RACE',
      description: 'Navigate through challenges and puzzles in this adventure-style tournament',
      icon: <DirectionsRun sx={{ fontSize: 48 }} />,
      color: '#4ECDC4',
      available: false,
      features: ['Adventure Challenges', 'Time-based Gameplay', 'Team Formation', 'Geographic Puzzles']
    },
    {
      id: 'mythical-combat',
      title: 'MYTHICAL COMBAT',
      description: 'Battle mythical creatures and other players in strategic combat',
      icon: <SportsKabaddi sx={{ fontSize: 48 }} />,
      color: '#45B7D1',
      available: false,
      features: ['Strategic Combat', 'Creature Collection', 'Skill Trees', 'PvP Battles']
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
              alignItems: 'center',
              py: 2,
              gap: 2
            }}
          >
            <IconButton
              onClick={() => navigate('/home')}
              sx={{
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderColor: 'rgba(255,255,255,0.5)'
                }
              }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '0.1em' }}>
              SELECT GAME
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            textAlign: 'center',
            color: 'rgba(255,255,255,0.7)',
            fontWeight: 400
          }}
        >
          Choose your tournament game mode
        </Typography>

        <Grid container spacing={3}>
          {gameData.map((game) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={game.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  opacity: game.available ? 1 : 0.7,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: game.available ? 'translateY(-4px)' : 'none',
                    boxShadow: game.available ? '0 8px 32px rgba(255,255,255,0.1)' : 'none'
                  }
                }}
              >
                {!game.available && (
                  <Chip
                    label="COMING SOON"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      zIndex: 1,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      fontSize: '0.7rem',
                      fontWeight: 600
                    }}
                  />
                )}
                
                <CardActionArea
                  onClick={() => handleGameClick(game.id)}
                  disabled={!game.available}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    cursor: game.available ? 'pointer' : 'not-allowed'
                  }}
                >
                  <CardContent sx={{ flex: 1, p: 3 }}>
                    {/* Game Icon */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 2,
                        color: game.color
                      }}
                    >
                      {game.icon}
                    </Box>

                    {/* Game Title */}
                    <Typography
                      variant="h5"
                      sx={{
                        textAlign: 'center',
                        fontWeight: 700,
                        mb: 2,
                        letterSpacing: '0.05em'
                      }}
                    >
                      {game.title}
                    </Typography>

                    {/* Game Description */}
                    <Typography
                      variant="body2"
                      sx={{
                        textAlign: 'center',
                        mb: 3,
                        color: 'rgba(255,255,255,0.7)',
                        lineHeight: 1.6
                      }}
                    >
                      {game.description}
                    </Typography>

                    {/* Features */}
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: 'rgba(255,255,255,0.9)'
                        }}
                      >
                        Features:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {game.features.map((feature) => (
                          <Chip
                            key={feature}
                            label={feature}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(255,255,255,0.1)',
                              color: 'white',
                              fontSize: '0.7rem',
                              opacity: game.available ? 1 : 0.5
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    {/* Action Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 'auto' }}>
                      <Button
                        variant="outlined"
                        disabled={!game.available}
                        startIcon={game.available ? <PlayArrow /> : null}
                        sx={{
                          borderColor: game.available ? game.color : 'rgba(255,255,255,0.3)',
                          color: game.available ? game.color : 'rgba(255,255,255,0.5)',
                          fontWeight: 600,
                          px: 3,
                          '&:hover': {
                            borderColor: game.available ? game.color : 'rgba(255,255,255,0.3)',
                            backgroundColor: game.available ? `${game.color}20` : 'transparent'
                          }
                        }}
                      >
                        {game.available ? 'PLAY NOW' : 'COMING SOON'}
                      </Button>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default SelectGames
