import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Box, Container, Typography, Paper, Button } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  const handleGetStarted = () => {
    if (isSignedIn) {
      navigate('/home');
    } else {
      navigate('/sign-in');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          py: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          color="primary"
          align="center"
          sx={{ fontWeight: 'bold' }}
        >
          AI Quiz Generator
        </Typography>
        
        <Typography
          variant="h5"
          color="text.secondary"
          align="center"
          sx={{ maxWidth: 600, mb: 4 }}
        >
          Create AI-powered quizzes, study with flashcards, and compete with others.
        </Typography>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            width: '100%',
            maxWidth: 500,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Typography variant="h6" align="center" color="text.primary">
            Ready to enhance your learning experience?
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            endIcon={<ArrowForwardIcon />}
            sx={{
              py: 1.5,
              px: 4,
              fontSize: '1.1rem',
            }}
          >
            Get Started
          </Button>

          <Typography variant="body2" color="text.secondary" align="center">
            {isSignedIn ? 'Continue to dashboard' : 'Sign in or create an account to begin'}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default LandingPage; 