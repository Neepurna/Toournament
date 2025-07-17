import React, { useState, useEffect } from 'react'
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
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider
} from '@mui/material'
import {
  ArrowBack,
  EmojiEvents,
  Add,
  Group,
  PlayArrow,
  PersonAdd,
  AttachMoney,
  Timer,
  People,
  TrendingUp,
  Close
} from '@mui/icons-material'
import { QUIZ_QUESTIONS, QuizQuestion } from './data/quizData'

interface Arena {
  id: string
  name: string
  creator: string
  entryFee: number
  maxPlayers: number
  currentPlayers: number
  timeLimit: number
  difficulty: string
  status: 'waiting' | 'in-progress' | 'completed'
  createdAt: Date
  startTime: Date
}

interface Player {
  id: string
  name: string
  avatar: string
  isAlive: boolean
  score: number
  streak: number
  joinedAt: Date
}

interface TournamentState {
  arenaId: string
  players: Player[]
  currentQuestion: QuizQuestion | null
  questionNumber: number
  timeLeft: number
  gameStarted: boolean
  gameEnded: boolean
  winner: Player | null
  usedQuestions: Set<number>
}

const mockArenas: Arena[] = [
  {
    id: '1',
    name: 'Quick Battle Arena',
    creator: '0x1234...5678',
    entryFee: 10,
    maxPlayers: 8,
    currentPlayers: 5,
    timeLimit: 30,
    difficulty: 'Medium',
    status: 'waiting',
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    startTime: new Date(Date.now() + 1000 * 60 * 2) // Starts in 2 minutes
  },
  {
    id: '2',
    name: 'High Stakes Challenge',
    creator: '0xabcd...ef12',
    entryFee: 50,
    maxPlayers: 16,
    currentPlayers: 12,
    timeLimit: 45,
    difficulty: 'Hard',
    status: 'waiting',
    createdAt: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    startTime: new Date(Date.now() + 1000 * 60 * 5) // Starts in 5 minutes
  },
  {
    id: '3',
    name: 'Beginner Friendly',
    creator: '0x9876...5432',
    entryFee: 5,
    maxPlayers: 4,
    currentPlayers: 3,
    timeLimit: 60,
    difficulty: 'Easy',
    status: 'waiting',
    createdAt: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
    startTime: new Date(Date.now() + 1000 * 30) // Starts in 30 seconds
  }
]

const mockPlayers: Player[] = [
  { id: '1', name: 'CryptoKing', avatar: '👑', isAlive: true, score: 0, streak: 0, joinedAt: new Date() },
  { id: '2', name: 'QuizMaster', avatar: '🧠', isAlive: true, score: 0, streak: 0, joinedAt: new Date() },
  { id: '3', name: 'BlockChainer', avatar: '⛓️', isAlive: true, score: 0, streak: 0, joinedAt: new Date() },
  { id: '4', name: 'TokenHunter', avatar: '🎯', isAlive: true, score: 0, streak: 0, joinedAt: new Date() },
  { id: '5', name: 'DeFiPro', avatar: '💎', isAlive: true, score: 0, streak: 0, joinedAt: new Date() },
]

const QuizRoyale: React.FC = () => {
  const navigate = useNavigate()
  const [arenas, setArenas] = useState<Arena[]>(mockArenas)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedArena, setSelectedArena] = useState<Arena | null>(null)
  const [showArenaDetails, setShowArenaDetails] = useState(false)
  const [countdownTime, setCountdownTime] = useState(0)
  const [tournament, setTournament] = useState<TournamentState | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<{ show: boolean; correct: boolean; message: string }>({
    show: false,
    correct: false,
    message: ''
  })
  const [newArena, setNewArena] = useState({
    name: '',
    entryFee: 10,
    maxPlayers: 8,
    timeLimit: 30,
    difficulty: 'Medium'
  })

  // Countdown timer effect
  useEffect(() => {
    if (selectedArena && showArenaDetails) {
      const timer = setInterval(() => {
        const now = new Date().getTime()
        const startTime = selectedArena.startTime.getTime()
        const timeLeft = Math.max(0, Math.floor((startTime - now) / 1000))
        setCountdownTime(timeLeft)
        
        if (timeLeft === 0 && !tournament?.gameStarted) {
          // Start tournament
          startTournament()
        }
      }, 1000)
      
      return () => clearInterval(timer)
    }
  }, [selectedArena, showArenaDetails, tournament])

  // Tournament timer effect
  useEffect(() => {
    if (tournament?.gameStarted && !tournament.gameEnded && tournament.timeLeft > 0) {
      const timer = setInterval(() => {
        setTournament(prev => {
          if (!prev) return null
          
          if (prev.timeLeft <= 1) {
            // Time's up - eliminate player
            handleTimeout()
            return prev
          }
          
          return { ...prev, timeLeft: prev.timeLeft - 1 }
        })
      }, 1000)
      
      return () => clearInterval(timer)
    }
  }, [tournament?.gameStarted, tournament?.gameEnded, tournament?.timeLeft])

  const startTournament = () => {
    if (!selectedArena) return
    
    const tournamentState: TournamentState = {
      arenaId: selectedArena.id,
      players: mockPlayers.slice(0, selectedArena.currentPlayers),
      currentQuestion: null,
      questionNumber: 0,
      timeLeft: selectedArena.timeLimit,
      gameStarted: true,
      gameEnded: false,
      winner: null,
      usedQuestions: new Set()
    }
    
    setTournament(tournamentState)
    setShowArenaDetails(false)
    loadNextQuestion(tournamentState)
  }

  const loadNextQuestion = (state: TournamentState) => {
    const availableQuestions = QUIZ_QUESTIONS.filter(q => !state.usedQuestions.has(q.id))
    
    if (availableQuestions.length === 0) {
      // No more questions, end tournament
      endTournament(state)
      return
    }
    
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
    state.usedQuestions.add(randomQuestion.id)
    
    setTournament(prev => ({
      ...state,
      currentQuestion: randomQuestion,
      questionNumber: state.questionNumber + 1,
      timeLeft: selectedArena?.timeLimit || 30
    }))
    
    setSelectedAnswer(null)
    setFeedback({ show: false, correct: false, message: '' })
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (!tournament?.currentQuestion || selectedAnswer !== null) return
    
    setSelectedAnswer(answerIndex)
    const correct = answerIndex === tournament.currentQuestion.correctAnswer
    
    setFeedback({
      show: true,
      correct,
      message: correct ? 'Correct! +100 points' : 'Wrong answer! You\'ve been eliminated.'
    })
    
    if (correct) {
      // Update player score
      setTournament(prev => {
        if (!prev) return null
        return {
          ...prev,
          players: prev.players.map(p => 
            p.id === '1' // Current player ID (mock)
              ? { ...p, score: p.score + 100, streak: p.streak + 1 }
              : p
          )
        }
      })
      
      // Load next question after delay
      setTimeout(() => {
        if (tournament) {
          loadNextQuestion(tournament)
        }
      }, 2000)
    } else {
      // Eliminate player
      eliminatePlayer('1') // Current player ID (mock)
    }
  }

  const handleTimeout = () => {
    setFeedback({
      show: true,
      correct: false,
      message: 'Time\'s up! You\'ve been eliminated.'
    })
    
    eliminatePlayer('1') // Current player ID (mock)
  }

  const eliminatePlayer = (playerId: string) => {
    setTournament(prev => {
      if (!prev) return null
      
      const updatedPlayers = prev.players.map(p => 
        p.id === playerId ? { ...p, isAlive: false } : p
      )
      
      const alivePlayers = updatedPlayers.filter(p => p.isAlive)
      
      if (alivePlayers.length <= 1) {
        // Tournament ended
        return {
          ...prev,
          players: updatedPlayers,
          gameEnded: true,
          winner: alivePlayers.length === 1 ? alivePlayers[0] : null
        }
      }
      
      return { ...prev, players: updatedPlayers }
    })
    
    // If current player is eliminated, show game over
    if (playerId === '1') {
      setTimeout(() => {
        setTournament(null)
      }, 3000)
    }
  }

  const endTournament = (state: TournamentState) => {
    const winner = state.players.reduce((prev, current) => 
      prev.score > current.score ? prev : current
    )
    
    setTournament(prev => ({
      ...state,
      gameEnded: true,
      winner
    }))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleCreateArena = () => {
    const arena: Arena = {
      id: Date.now().toString(),
      name: newArena.name || 'New Arena',
      creator: '0x1234...abcd', // This would be the actual connected wallet
      entryFee: newArena.entryFee,
      maxPlayers: newArena.maxPlayers,
      currentPlayers: 1,
      timeLimit: newArena.timeLimit,
      difficulty: newArena.difficulty,
      status: 'waiting',
      createdAt: new Date(),
      startTime: new Date(Date.now() + 1000 * 60 * 2) // Start in 2 minutes
    }
    
    setArenas(prev => [arena, ...prev])
    setShowCreateDialog(false)
    setNewArena({
      name: '',
      entryFee: 10,
      maxPlayers: 8,
      timeLimit: 30,
      difficulty: 'Medium'
    })
    
    // Show arena details
    setSelectedArena(arena)
    setShowArenaDetails(true)
  }

  const handleJoinArena = (arenaId: string) => {
    const arena = arenas.find(a => a.id === arenaId)
    if (!arena) return

    if (arena.currentPlayers >= arena.maxPlayers) {
      alert('Arena is full!')
      return
    }

    setArenas(prev => 
      prev.map(a => 
        a.id === arenaId 
          ? { ...a, currentPlayers: a.currentPlayers + 1 }
          : a
      )
    )
    
    // Show arena details after joining
    const updatedArena = { ...arena, currentPlayers: arena.currentPlayers + 1 }
    setSelectedArena(updatedArena)
    setShowArenaDetails(true)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#4CAF50'
      case 'Medium': return '#FF9800'
      case 'Hard': return '#F44336'
      case 'Expert': return '#9C27B0'
      default: return '#4CAF50'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return '#4CAF50'
      case 'in-progress': return '#FF9800'
      case 'completed': return '#9E9E9E'
      default: return '#4CAF50'
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  // Tournament View
  if (tournament) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
          color: 'white',
          fontFamily: 'Monaco, monospace'
        }}
      >
        {/* Tournament Header */}
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
                <EmojiEvents sx={{ fontSize: 32, color: '#FF6B6B' }} />
                <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '0.1em' }}>
                  TOURNAMENT
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Typography variant="h6" sx={{ color: '#4CAF50' }}>
                  Players: {tournament.players.filter(p => p.isAlive).length}
                </Typography>
                <Typography variant="h6" sx={{ color: '#FF9800' }}>
                  Question: {tournament.questionNumber}
                </Typography>
                <Typography variant="h6" sx={{ color: '#F44336' }}>
                  Time: {formatTime(tournament.timeLeft)}
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Grid container spacing={3}>
            {/* Main Quiz Area */}
            <Grid size={{ xs: 12, md: 8 }}>
              {tournament.gameEnded ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <EmojiEvents sx={{ fontSize: 80, color: '#FFD700', mb: 2 }} />
                  <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
                    {tournament.winner ? `${tournament.winner.name} Wins!` : 'Tournament Ended'}
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 4, color: 'rgba(255,255,255,0.7)' }}>
                    {tournament.winner ? `Prize: ${selectedArena?.entryFee}0 USDT` : 'No winner'}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => setTournament(null)}
                    sx={{
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      fontWeight: 600,
                      px: 4,
                      py: 1.5
                    }}
                  >
                    Back to Arenas
                  </Button>
                </Box>
              ) : tournament.currentQuestion ? (
                <Card sx={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ mb: 3 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(tournament.timeLeft / (selectedArena?.timeLimit || 30)) * 100}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: tournament.timeLeft <= 5 ? '#F44336' : '#4CAF50'
                          }
                        }}
                      />
                    </Box>
                    
                    <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
                      {tournament.currentQuestion.question}
                    </Typography>
                    
                    <Grid container spacing={2}>
                      {tournament.currentQuestion.options.map((option, index) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={index}>
                          <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => handleAnswerSelect(index)}
                            disabled={selectedAnswer !== null}
                            sx={{
                              p: 2,
                              textAlign: 'left',
                              justifyContent: 'flex-start',
                              color: selectedAnswer === index 
                                ? (selectedAnswer === tournament.currentQuestion.correctAnswer ? '#4CAF50' : '#F44336')
                                : 'white',
                              borderColor: selectedAnswer === index 
                                ? (selectedAnswer === tournament.currentQuestion.correctAnswer ? '#4CAF50' : '#F44336')
                                : 'rgba(255,255,255,0.3)',
                              backgroundColor: selectedAnswer === index 
                                ? (selectedAnswer === tournament.currentQuestion.correctAnswer ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)')
                                : 'transparent',
                              '&:hover': {
                                backgroundColor: selectedAnswer === null ? 'rgba(255,255,255,0.1)' : undefined
                              }
                            }}
                          >
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {String.fromCharCode(65 + index)}. {option}
                            </Typography>
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                    
                    {feedback.show && (
                      <Box sx={{ mt: 3, p: 2, backgroundColor: feedback.correct ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)', borderRadius: 2 }}>
                        <Typography variant="body1" sx={{ color: feedback.correct ? '#4CAF50' : '#F44336', fontWeight: 600 }}>
                          {feedback.message}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    Loading next question...
                  </Typography>
                </Box>
              )}
            </Grid>

            {/* Leaderboard */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <TrendingUp sx={{ color: '#4CAF50' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Live Leaderboard
                    </Typography>
                  </Box>
                  
                  <List>
                    {tournament.players
                      .sort((a, b) => b.score - a.score)
                      .map((player, index) => (
                        <ListItem key={player.id} sx={{ px: 0 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ backgroundColor: player.isAlive ? '#4CAF50' : '#F44336' }}>
                              {player.avatar}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                  {player.name}
                                </Typography>
                                {!player.isAlive && (
                                  <Chip label="ELIMINATED" size="small" sx={{ backgroundColor: '#F44336', color: 'white' }} />
                                )}
                              </Box>
                            }
                            secondary={
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                Score: {player.score} | Streak: {player.streak}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    )
  }

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
              <IconButton
                onClick={() => navigate('/ultimate-quiz')}
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
                <EmojiEvents sx={{ fontSize: 32, color: '#FF6B6B' }} />
                <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '0.1em' }}>
                  QUIZ ROYALE
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowCreateDialog(true)}
              sx={{
                backgroundColor: '#FF6B6B',
                color: 'white',
                fontWeight: 600,
                px: 3,
                py: 1,
                '&:hover': {
                  backgroundColor: '#FF5252'
                }
              }}
            >
              CREATE ARENA
            </Button>
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
            Competitive Quiz Battles
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
            Join or create quiz arenas to battle other players in real-time. Win USDT prizes and climb the leaderboards!
          </Typography>
        </Box>

        {/* Stats Bar */}
        <Box sx={{ mb: 6 }}>
          <Grid container spacing={3} justifyContent="center">
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 700 }}>
                  {arenas.filter(a => a.status === 'waiting').length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Active Arenas
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ color: '#FF9800', fontWeight: 700 }}>
                  {arenas.reduce((sum, a) => sum + a.currentPlayers, 0)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Players Online
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ color: '#FF6B6B', fontWeight: 700 }}>
                  {arenas.reduce((sum, a) => sum + (a.entryFee * a.currentPlayers), 0)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Total Prize Pool
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ color: '#9C27B0', fontWeight: 700 }}>
                  24/7
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Available
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Arenas List */}
        <Box>
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.9)'
            }}
          >
            Available Arenas
          </Typography>

          <Grid container spacing={3}>
            {arenas.map((arena) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={arena.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 32px rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  <CardActionArea
                    onClick={() => handleJoinArena(arena.id)}
                    disabled={arena.currentPlayers >= arena.maxPlayers}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch'
                    }}
                  >
                    <CardContent sx={{ flex: 1, p: 3 }}>
                      {/* Arena Status */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Chip
                          label={arena.status.toUpperCase()}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(arena.status),
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.7rem'
                          }}
                        />
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                          {formatTimeAgo(arena.createdAt)}
                        </Typography>
                      </Box>

                      {/* Arena Name */}
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                          letterSpacing: '0.02em'
                        }}
                      >
                        {arena.name}
                      </Typography>

                      {/* Creator */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255,255,255,0.7)',
                          mb: 3,
                          fontFamily: 'Monaco, monospace'
                        }}
                      >
                        By {arena.creator}
                      </Typography>

                      {/* Arena Details */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AttachMoney sx={{ fontSize: 16, color: '#4CAF50' }} />
                            <Typography variant="body2">Entry Fee</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#4CAF50' }}>
                            {arena.entryFee} USDT
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <People sx={{ fontSize: 16, color: '#FF9800' }} />
                            <Typography variant="body2">Players</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {arena.currentPlayers}/{arena.maxPlayers}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Timer sx={{ fontSize: 16, color: '#2196F3' }} />
                            <Typography variant="body2">Time Limit</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {arena.timeLimit}s
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Difficulty</Typography>
                          <Chip
                            label={arena.difficulty}
                            size="small"
                            sx={{
                              backgroundColor: getDifficultyColor(arena.difficulty),
                              color: 'white',
                              fontSize: '0.7rem'
                            }}
                          />
                        </Box>
                      </Box>

                      {/* Prize Pool */}
                      <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 1 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                          Prize Pool
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFD700' }}>
                          {arena.entryFee * arena.currentPlayers} USDT
                        </Typography>
                      </Box>

                      {/* Join Button */}
                      <Button
                        variant="contained"
                        fullWidth
                        disabled={arena.currentPlayers >= arena.maxPlayers}
                        startIcon={arena.currentPlayers >= arena.maxPlayers ? null : <PersonAdd />}
                        sx={{
                          mt: 3,
                          backgroundColor: arena.currentPlayers >= arena.maxPlayers ? '#666' : '#FF6B6B',
                          color: 'white',
                          fontWeight: 600,
                          '&:hover': {
                            backgroundColor: arena.currentPlayers >= arena.maxPlayers ? '#666' : '#FF5252'
                          }
                        }}
                      >
                        {arena.currentPlayers >= arena.maxPlayers ? 'ARENA FULL' : 'JOIN ARENA'}
                      </Button>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Create Arena Dialog */}
      <Dialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              backgroundColor: '#1a1a1a',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)'
            }
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Create New Arena
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Arena Name"
              value={newArena.name}
              onChange={(e) => setNewArena(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
              placeholder="Enter arena name"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
              }}
            />

            <TextField
              label="Entry Fee"
              type="number"
              value={newArena.entryFee}
              onChange={(e) => setNewArena(prev => ({ ...prev, entryFee: Number(e.target.value) }))}
              fullWidth
              InputProps={{
                endAdornment: <InputAdornment position="end">USDT</InputAdornment>
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
              }}
            />

            <TextField
              label="Max Players"
              type="number"
              value={newArena.maxPlayers}
              onChange={(e) => setNewArena(prev => ({ ...prev, maxPlayers: Number(e.target.value) }))}
              fullWidth
              inputProps={{ min: 2, max: 32 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
              }}
            />

            <TextField
              label="Time Limit (seconds)"
              type="number"
              value={newArena.timeLimit}
              onChange={(e) => setNewArena(prev => ({ ...prev, timeLimit: Number(e.target.value) }))}
              fullWidth
              inputProps={{ min: 10, max: 120 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={() => setShowCreateDialog(false)}
            sx={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateArena}
            variant="contained"
            sx={{
              backgroundColor: '#FF6B6B',
              color: 'white',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#FF5252'
              }
            }}
          >
            Create Arena
          </Button>
        </DialogActions>
      </Dialog>

      {/* Arena Details Dialog */}
      <Dialog
        open={showArenaDetails}
        onClose={() => setShowArenaDetails(false)}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: 'rgba(17, 17, 17, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'white' }}>
            Arena Details
          </Typography>
          <IconButton onClick={() => setShowArenaDetails(false)} sx={{ color: 'rgba(255,255,255,0.7)' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        {selectedArena && (
          <DialogContent sx={{ pt: 2 }}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'white' }}>
                  {selectedArena.name}
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <AttachMoney sx={{ color: '#4CAF50' }} />
                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                        Entry Fee: {selectedArena.entryFee} USDT
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <People sx={{ color: '#2196F3' }} />
                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                        Players: {selectedArena.currentPlayers}/{selectedArena.maxPlayers}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Timer sx={{ color: '#FF9800' }} />
                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                        Time Limit: {selectedArena.timeLimit}s
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <EmojiEvents sx={{ color: getDifficultyColor(selectedArena.difficulty) }} />
                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                        Difficulty: {selectedArena.difficulty}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            {/* Countdown Timer */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              {countdownTime > 0 ? (
                <>
                  <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: '#FF6B6B' }}>
                    {formatTime(countdownTime)}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Tournament starts in...
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={100 - (countdownTime / 120) * 100} // Assuming 2 minutes max
                    sx={{
                      mt: 2,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#FF6B6B'
                      }
                    }}
                  />
                </>
              ) : (
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#4CAF50' }}>
                  Tournament is starting...
                </Typography>
              )}
            </Box>
            
            {/* Players List */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'white' }}>
              Joined Players
            </Typography>
            <List>
              {mockPlayers.slice(0, selectedArena.currentPlayers).map((player, index) => (
                <ListItem key={player.id} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: '#4CAF50' }}>
                      {player.avatar}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'white' }}>
                        {player.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Ready to compete
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
        )}
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setShowArenaDetails(false)}
            sx={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default QuizRoyale
