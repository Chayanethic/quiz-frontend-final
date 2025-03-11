import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import {
  Replay as RetryIcon,
  LibraryBooks as FlashcardIcon,
  Leaderboard as LeaderboardIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { api } from '../services/api';
import { LeaderboardEntry } from '../types';

const QuizResult = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerName] = useState(localStorage.getItem('playerName') || '');
  const [playerScore, setPlayerScore] = useState<number | null>(null);

  useEffect(() => {
    if (quizId) {
      fetchLeaderboard();
    }
  }, [quizId]);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.getLeaderboard(quizId!);
      setLeaderboard(response.leaderboard);
      const playerEntry = response.leaderboard.find(entry => entry.player_name === playerName);
      if (playerEntry) {
        setPlayerScore(playerEntry.score);
      }
    } catch (err) {
      setError('Failed to fetch results');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const playerRank = leaderboard.findIndex(entry => entry.player_name === playerName) + 1;
  const totalParticipants = leaderboard.length;

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom color="primary">
            Quiz Completed!
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ my: 4 }}>
            <Typography variant="h6" gutterBottom>
              Congratulations, {playerName}!
            </Typography>

            {playerScore !== null && (
              <Typography variant="h3" color="primary" sx={{ my: 3 }}>
                Score: {playerScore}
              </Typography>
            )}

            {playerRank > 0 && (
              <Typography variant="subtitle1" color="text.secondary">
                Your Rank: {playerRank} of {totalParticipants}
              </Typography>
            )}
          </Box>

          <Grid container spacing={2} sx={{ mt: 4 }}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<RetryIcon />}
                onClick={() => navigate(`/quiz/${quizId}`)}
                sx={{ mb: { xs: 2, sm: 0 } }}
              >
                Try Again
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<FlashcardIcon />}
                onClick={() => navigate(`/flashcards/${quizId}`)}
              >
                Study Flashcards
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<LeaderboardIcon />}
                onClick={() => navigate(`/leaderboard/${quizId}`)}
                sx={{ mb: { xs: 2, sm: 0 } }}
              >
                View Leaderboard
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<HomeIcon />}
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default QuizResult; 