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
  EmojiEvents,
  PlayArrow,
  School
} from '@mui/icons-material'

const UltimateQuiz: React.FC = () => {
  const navigate = useNavigate()

  const handleModeClick = (modeId: string) => {
    if (modeId === 'practice-mode') {
      navigate('/practice-quiz')
    } else if (modeId === 'quiz-royale') {
      // Navigate to Quiz Royale mode
      alert('Quiz Royale mode will be implemented next')
    } else {
      console.log(`${modeId} mode will be implemented next`)
    }
  }

  const quizModes = [
    {
      id: 'practice-mode',
      title: 'PRACTICE MODE',
      description: 'Sharpen your skills with challenging questions. One wrong answer ends the game - how far can you go?',
      icon: <School sx={{ fontSize: 48 }} />,
      color: '#4ECDC4',
      features: ['No Entry Fee', 'Instant Feedback', 'Streak Scoring', 'Survival Mode'],
      buttonText: 'START PRACTICE',
      subtitle: 'Survival mode - one mistake ends the game'
    },
    {
      id: 'quiz-royale',
      title: 'QUIZ ROYALE',
      description: 'Join the ultimate competitive quiz tournament. Battle against other players in real-time for USDT prizes.',
      icon: <EmojiEvents sx={{ fontSize: 48 }} />,
      color: '#FF6B6B',
      features: ['Real-time Battles', 'USDT Prizes', 'Ranked Matches', 'Leaderboards'],
      buttonText: 'JOIN ROYALE',
      subtitle: 'High-stakes competitive tournament'
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
              onClick={() => navigate('/games')}
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Quiz sx={{ fontSize: 32, color: '#4ECDC4' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '0.1em' }}>
                THE ULTIMATE QUIZ
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 600
            }}
          >
            Test Your Knowledge
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255,255,255,0.7)',
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Challenge yourself with our comprehensive quiz system. Choose between practice mode to improve your skills or jump into competitive battles for real rewards.
          </Typography>
        </Box>

        {/* Quiz Mode Cards */}
        <Grid container spacing={4} justifyContent="center">
          {quizModes.map((mode) => (
            <Grid size={{ xs: 12, md: 6 }} key={mode.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 32px ${mode.color}30`
                  }
                }}
              >
                <CardActionArea
                  onClick={() => handleModeClick(mode.id)}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch'
                  }}
                >
                  <CardContent sx={{ flex: 1, p: 4 }}>
                    {/* Mode Icon */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 2,
                        color: mode.color
                      }}
                    >
                      {mode.icon}
                    </Box>

                    {/* Mode Title */}
                    <Typography
                      variant="h4"
                      sx={{
                        textAlign: 'center',
                        fontWeight: 700,
                        mb: 1,
                        letterSpacing: '0.05em'
                      }}
                    >
                      {mode.title}
                    </Typography>

                    {/* Subtitle */}
                    <Typography
                      variant="body2"
                      sx={{
                        textAlign: 'center',
                        mb: 3,
                        color: mode.color,
                        fontWeight: 500
                      }}
                    >
                      {mode.subtitle}
                    </Typography>

                    {/* Mode Description */}
                    <Typography
                      variant="body1"
                      sx={{
                        textAlign: 'center',
                        mb: 4,
                        color: 'rgba(255,255,255,0.8)',
                        lineHeight: 1.6
                      }}
                    >
                      {mode.description}
                    </Typography>

                    {/* Features */}
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                          color: 'rgba(255,255,255,0.9)',
                          textAlign: 'center'
                        }}
                      >
                        Features:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                        {mode.features.map((feature) => (
                          <Chip
                            key={feature}
                            label={feature}
                            size="small"
                            sx={{
                              backgroundColor: `${mode.color}20`,
                              color: mode.color,
                              fontSize: '0.7rem',
                              fontWeight: 500,
                              border: `1px solid ${mode.color}40`
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    {/* Action Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 'auto' }}>
                      <Button
                        variant="contained"
                        startIcon={<PlayArrow />}
                        sx={{
                          backgroundColor: mode.color,
                          color: 'black',
                          fontWeight: 700,
                          px: 4,
                          py: 1.5,
                          fontSize: '1rem',
                          '&:hover': {
                            backgroundColor: mode.color,
                            filter: 'brightness(1.1)',
                            transform: 'scale(1.05)'
                          }
                        }}
                      >
                        {mode.buttonText}
                      </Button>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Additional Info Section */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 600
            }}
          >
            How It Works
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ color: '#4ECDC4', mb: 1 }}>
                  1. Choose Mode
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Select between Practice Mode for skill building or Quiz Royale for competitive battles
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ color: '#FF6B6B', mb: 1 }}>
                  2. Answer Questions
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Answer questions correctly to advance. One wrong answer ends the game immediately.
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ color: '#45B7D1', mb: 1 }}>
                  3. Earn Rewards
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Build winning streaks for bonus points and watch difficulty increase as you progress
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}

export default UltimateQuiz
