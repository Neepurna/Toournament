import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ArrowBack,
  Timer,
  Star,
  CheckCircle,
  Cancel,
  Pause,
  PlayArrow
} from '@mui/icons-material';
import { QUIZ_QUESTIONS, DIFFICULTY_SETTINGS, GAME_SETTINGS, QuizQuestion } from './data/quizData';

interface QuizGameState {
  currentQuestionIndex: number;
  score: number;
  streak: number;
  timeRemaining: number;
  isGameActive: boolean;
  isPaused: boolean;
  selectedAnswer: number | null;
  isAnswerSubmitted: boolean;
  showResult: boolean;
  gameOver: boolean;
  difficulty: 1 | 2 | 3 | 4 | 5;
  questionsAnswered: number;
  correctAnswers: number;
  currentQuestion: QuizQuestion;
}

const PracticeQuiz: React.FC = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<QuizGameState>({
    currentQuestionIndex: 0,
    score: 0,
    streak: 0,
    timeRemaining: GAME_SETTINGS.INITIAL_TIME,
    isGameActive: false,
    isPaused: false,
    selectedAnswer: null,
    isAnswerSubmitted: false,
    showResult: false,
    gameOver: false,
    difficulty: 1,
    questionsAnswered: 0,
    correctAnswers: 0,
    currentQuestion: QUIZ_QUESTIONS[0]
  });

  const [showGameOverDialog, setShowGameOverDialog] = useState(false);

  // Get questions for current difficulty
  const getQuestionsForDifficulty = useCallback((difficulty: number) => {
    return QUIZ_QUESTIONS.filter((q: QuizQuestion) => q.difficulty === difficulty);
  }, []);

  // Calculate current difficulty based on questions answered
  const getCurrentDifficulty = useCallback((questionsAnswered: number): 1 | 2 | 3 | 4 | 5 => {
    if (questionsAnswered < 5) return 1;
    if (questionsAnswered < 10) return 2;
    if (questionsAnswered < 15) return 3;
    if (questionsAnswered < 20) return 4;
    return 5;
  }, []);

  // Get next question
  const getNextQuestion = useCallback(() => {
    const currentDifficulty = getCurrentDifficulty(gameState.questionsAnswered);
    const questionsForDifficulty = getQuestionsForDifficulty(currentDifficulty);
    
    if (questionsForDifficulty.length === 0) {
      return null;
    }
    
    // Get random question from current difficulty
    const randomIndex = Math.floor(Math.random() * questionsForDifficulty.length);
    return questionsForDifficulty[randomIndex];
  }, [gameState.questionsAnswered, getCurrentDifficulty, getQuestionsForDifficulty]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState.isGameActive && !gameState.isPaused && !gameState.showResult) {
      interval = setInterval(() => {
        setGameState(prev => {
          if (prev.timeRemaining <= 1) {
            return {
              ...prev,
              timeRemaining: 0,
              gameOver: true,
              isGameActive: false
            };
          }
          return {
            ...prev,
            timeRemaining: prev.timeRemaining - 1
          };
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameState.isGameActive, gameState.isPaused, gameState.showResult]);

  // Game over effect
  useEffect(() => {
    if (gameState.gameOver) {
      setShowGameOverDialog(true);
    }
  }, [gameState.gameOver]);

  // Auto-start the game when component mounts
  useEffect(() => {
    const firstQuestion = getNextQuestion();
    if (firstQuestion) {
      setGameState(prev => ({
        ...prev,
        isGameActive: true,
        currentQuestion: firstQuestion,
        difficulty: getCurrentDifficulty(0)
      }));
    }
  }, []);

  const startGame = () => {
    const firstQuestion = getNextQuestion();
    if (firstQuestion) {
      setGameState(prev => ({
        ...prev,
        isGameActive: true,
        currentQuestion: firstQuestion,
        difficulty: getCurrentDifficulty(0)
      }));
    }
  };

  const pauseGame = () => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
  };

  const selectAnswer = (answerIndex: number) => {
    if (gameState.isAnswerSubmitted) return;

    const isCorrect = answerIndex === gameState.currentQuestion.correctAnswer;
    const difficultySettings = DIFFICULTY_SETTINGS[gameState.difficulty];
    
    let newScore = gameState.score;
    let newStreak = gameState.streak;
    let newTimeRemaining = gameState.timeRemaining;

    if (isCorrect) {
      // Calculate points with streak bonus
      const basePoints = difficultySettings.pointsBase;
      const streakMultiplier = gameState.streak >= 3 ? GAME_SETTINGS.STREAK_BONUS_MULTIPLIER : 1;
      const pointsEarned = Math.floor(basePoints * streakMultiplier);
      
      newScore += pointsEarned;
      newStreak += 1;
      newTimeRemaining = Math.min(
        newTimeRemaining + GAME_SETTINGS.TIME_BONUS_CORRECT,
        GAME_SETTINGS.MAX_TIME
      );

      // Set the selected answer and show result
      setGameState(prev => ({
        ...prev,
        selectedAnswer: answerIndex,
        isAnswerSubmitted: true,
        showResult: true,
        score: newScore,
        streak: newStreak,
        timeRemaining: newTimeRemaining,
        correctAnswers: prev.correctAnswers + 1
      }));

      // Auto-advance to next question after 1.5 seconds
      setTimeout(() => {
        nextQuestion();
      }, 1500);
    } else {
      // Wrong answer - game over immediately
      setGameState(prev => ({
        ...prev,
        selectedAnswer: answerIndex,
        isAnswerSubmitted: true,
        showResult: true,
        score: newScore,
        streak: 0,
        timeRemaining: newTimeRemaining,
        gameOver: true,
        isGameActive: false
      }));
    }
  };

  const nextQuestion = () => {
    const nextQ = getNextQuestion();
    const newQuestionsAnswered = gameState.questionsAnswered + 1;
    const newDifficulty = getCurrentDifficulty(newQuestionsAnswered);

    if (!nextQ || gameState.timeRemaining <= 0) {
      setGameState(prev => ({
        ...prev,
        gameOver: true,
        isGameActive: false
      }));
      return;
    }

    setGameState(prev => ({
      ...prev,
      currentQuestion: nextQ,
      questionsAnswered: newQuestionsAnswered,
      difficulty: newDifficulty,
      selectedAnswer: null,
      isAnswerSubmitted: false,
      showResult: false
    }));
  };

  const restartGame = () => {
    const firstQuestion = getNextQuestion();
    setGameState({
      currentQuestionIndex: 0,
      score: 0,
      streak: 0,
      timeRemaining: GAME_SETTINGS.INITIAL_TIME,
      isGameActive: true,
      isPaused: false,
      selectedAnswer: null,
      isAnswerSubmitted: false,
      showResult: false,
      gameOver: false,
      difficulty: 1,
      questionsAnswered: 0,
      correctAnswers: 0,
      currentQuestion: firstQuestion || QUIZ_QUESTIONS[0]
    });
    setShowGameOverDialog(false);
  };

  const getAnswerIcon = (index: number) => {
    if (gameState.showResult && index === gameState.currentQuestion.correctAnswer) {
      return <CheckCircle sx={{ color: '#4CAF50' }} />;
    }
    if (gameState.showResult && index === gameState.selectedAnswer) {
      return <Cancel sx={{ color: '#F44336' }} />;
    }
    return null;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: number) => {
    return DIFFICULTY_SETTINGS[difficulty as keyof typeof DIFFICULTY_SETTINGS]?.color || '#4CAF50';
  };

  const getTimerColor = (): string => {
    if (gameState.timeRemaining <= 10) return '#f44336';
    if (gameState.timeRemaining <= 30) return '#ff9800';
    return '#4caf50';
  };

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
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                PRACTICE MODE
              </Typography>
            </Box>

            {/* Game Stats */}
            {gameState.isGameActive && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Timer sx={{ color: getTimerColor() }} />
                  <Typography
                    variant="h6"
                    sx={{
                      color: getTimerColor(),
                      fontWeight: 600,
                      minWidth: '60px'
                    }}
                  >
                    {formatTime(gameState.timeRemaining)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Star sx={{ color: '#FFD700' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {gameState.score}
                  </Typography>
                </Box>
                <Chip
                  label={`Difficulty ${gameState.difficulty}`}
                  sx={{
                    backgroundColor: getDifficultyColor(gameState.difficulty),
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        {!gameState.isGameActive ? (
          /* Start Screen */
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h3" sx={{ mb: 4, fontWeight: 700 }}>
              Ready to Practice?
            </Typography>
            <Typography variant="h6" sx={{ mb: 6, color: 'rgba(255,255,255,0.7)' }}>
              Test your knowledge with unlimited questions. Choose wisely - one wrong answer ends the game!
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={startGame}
              startIcon={<PlayArrow />}
              sx={{
                backgroundColor: '#4CAF50',
                color: 'white',
                px: 6,
                py: 2,
                fontSize: '1.2rem',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#45a049'
                }
              }}
            >
              START PRACTICE
            </Button>
          </Box>
        ) : (
          /* Game Screen */
          <Box>
            {/* Progress Bar */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Question {gameState.questionsAnswered + 1}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Streak: {gameState.streak}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(gameState.timeRemaining / GAME_SETTINGS.MAX_TIME) * 100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getTimerColor(),
                    borderRadius: 4
                  }
                }}
              />
            </Box>

            {/* Question Card */}
            <Card
              sx={{
                mb: 4,
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: `2px solid ${getDifficultyColor(gameState.difficulty)}`,
                position: 'relative'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Chip
                    label={gameState.currentQuestion.category}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'white'
                    }}
                  />
                  <IconButton
                    onClick={pauseGame}
                    sx={{
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    {gameState.isPaused ? <PlayArrow /> : <Pause />}
                  </IconButton>
                </Box>

                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    fontWeight: 600,
                    lineHeight: 1.4
                  }}
                >
                  {gameState.currentQuestion.question}
                </Typography>

                {/* Answer Options */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {gameState.currentQuestion.options.map((option: string, index: number) => {
                    let buttonColor = 'rgba(255,255,255,0.1)';
                    let borderColor = 'rgba(255,255,255,0.3)';
                    let textColor = 'white';

                    if (gameState.showResult) {
                      if (index === gameState.currentQuestion.correctAnswer) {
                        buttonColor = 'rgba(76,175,80,0.3)';
                        borderColor = '#4CAF50';
                      } else if (index === gameState.selectedAnswer) {
                        buttonColor = 'rgba(244,67,54,0.3)';
                        borderColor = '#F44336';
                      }
                    } else if (gameState.selectedAnswer === index) {
                      buttonColor = getDifficultyColor(gameState.difficulty) + '30';
                      borderColor = getDifficultyColor(gameState.difficulty);
                    }

                    return (
                      <Button
                        key={`${gameState.currentQuestion.id}-option-${index}`}
                        variant="outlined"
                        onClick={() => selectAnswer(index)}
                        disabled={gameState.isAnswerSubmitted || gameState.isPaused}
                        sx={{
                          p: 3,
                          justifyContent: 'flex-start',
                          textAlign: 'left',
                          backgroundColor: buttonColor,
                          borderColor: borderColor,
                          color: textColor,
                          fontSize: '1rem',
                          fontWeight: 500,
                          '&:hover': {
                            backgroundColor: buttonColor,
                            borderColor: borderColor
                          }
                        }}
                        startIcon={getAnswerIcon(index)}
                      >
                        {String.fromCharCode(65 + index)}. {option}
                      </Button>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </Container>

      {/* Game Over Dialog */}
      <Dialog
        open={showGameOverDialog}
        onClose={() => setShowGameOverDialog(false)}
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
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {gameState.timeRemaining <= 0 ? 'Time\'s Up!' : 'Game Over!'}
          </Typography>
          {gameState.correctAnswers === gameState.questionsAnswered && gameState.questionsAnswered > 0 && (
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>
              Perfect streak ended by time!
            </Typography>
          )}
          {gameState.correctAnswers < gameState.questionsAnswered && (
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>
              Wrong answer ended your streak!
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h2" sx={{ color: '#FFD700', mb: 2 }}>
              {gameState.score}
            </Typography>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Final Score
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
              <Box>
                <Typography variant="h5" sx={{ color: '#4CAF50' }}>
                  {gameState.correctAnswers}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Correct
                </Typography>
              </Box>
              <Box>
                <Typography variant="h5" sx={{ color: '#F44336' }}>
                  {gameState.questionsAnswered - gameState.correctAnswers}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Incorrect
                </Typography>
              </Box>
              <Box>
                <Typography variant="h5" sx={{ color: '#FF9800' }}>
                  {Math.round((gameState.correctAnswers / gameState.questionsAnswered) * 100)}%
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Accuracy
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={restartGame}
            variant="contained"
            sx={{
              backgroundColor: '#4CAF50',
              color: 'white',
              px: 4,
              py: 1.5,
              mr: 2
            }}
          >
            PLAY AGAIN
          </Button>
          <Button
            onClick={() => navigate('/ultimate-quiz')}
            variant="outlined"
            sx={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
              px: 4,
              py: 1.5
            }}
          >
            BACK TO MENU
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PracticeQuiz;
