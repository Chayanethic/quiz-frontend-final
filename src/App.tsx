import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ClerkProvider, SignIn, SignUp, useAuth } from '@clerk/clerk-react';
import QuizHome from './components/QuizHome';
import QuizQuestion from './components/QuizQuestion';
import QuizResult from './components/QuizResult';
import CreateQuiz from './components/CreateQuiz';
import RecentQuizzes from './components/RecentQuizzes';
import Flashcards from './components/Flashcards';
import Leaderboard from './components/Leaderboard';
import LandingPage from './components/LandingPage';

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              }
            />
            <Route
              path="/sign-in/*"
              element={
                <PublicRoute>
                  <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" afterSignInUrl="/home" />
                </PublicRoute>
              }
            />
            <Route
              path="/sign-up/*"
              element={
                <PublicRoute>
                  <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" afterSignUpUrl="/home" />
                </PublicRoute>
              }
            />
            
            <Route path="/home" element={
              <ProtectedRoute>
                <QuizHome />
              </ProtectedRoute>
            } />
            <Route path="/create" element={
              <ProtectedRoute>
                <CreateQuiz />
              </ProtectedRoute>
            } />
            <Route path="/recent" element={
              <ProtectedRoute>
                <RecentQuizzes />
              </ProtectedRoute>
            } />
            <Route path="/quiz/:quizId" element={
              <ProtectedRoute>
                <QuizQuestion />
              </ProtectedRoute>
            } />
            <Route path="/result/:quizId" element={
              <ProtectedRoute>
                <QuizResult />
              </ProtectedRoute>
            } />
            <Route path="/flashcards/:quizId" element={
              <ProtectedRoute>
                <Flashcards />
              </ProtectedRoute>
            } />
            <Route path="/leaderboard/:quizId" element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default App; 