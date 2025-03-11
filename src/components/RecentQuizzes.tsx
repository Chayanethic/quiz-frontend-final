import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import { api } from '../services/api';
import { RecentQuiz } from '../types';

const RecentQuizzes = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userQuizzes, setUserQuizzes] = useState<RecentQuiz[]>([]);
  const [allQuizzes, setAllQuizzes] = useState<RecentQuiz[]>([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const [userResponse, allResponse] = await Promise.all([
          api.getUserQuizzes(user!.id),
          api.getRecentQuizzes(),
        ]);
        setUserQuizzes(userResponse);
        setAllQuizzes(allResponse);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchQuizzes();
    }
  }, [user]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 4 }}>
          Recent Quizzes
        </Typography>

        <Paper elevation={3} sx={{ borderRadius: 2 }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="My Quizzes" />
            <Tab label="All Quizzes" />
          </Tabs>

          <List sx={{ py: 0 }}>
            {(tab === 0 ? userQuizzes : allQuizzes).map((quiz, index) => (
              <ListItem
                key={quiz.quiz_id}
                divider={index < (tab === 0 ? userQuizzes.length - 1 : allQuizzes.length - 1)}
                disablePadding
              >
                <ListItemButton onClick={() => navigate(`/quiz/${quiz.quiz_id}`)}>
                  <ListItemText
                    primary={quiz.content_name}
                    secondary={formatDate(quiz.created_at)}
                    primaryTypographyProps={{
                      fontWeight: 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
            {((tab === 0 && userQuizzes.length === 0) || (tab === 1 && allQuizzes.length === 0)) && (
              <ListItem>
                <ListItemText
                  primary={tab === 0 ? "You haven't created any quizzes yet" : "No quizzes available"}
                  sx={{ textAlign: 'center', color: 'text.secondary' }}
                />
              </ListItem>
            )}
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default RecentQuizzes; 