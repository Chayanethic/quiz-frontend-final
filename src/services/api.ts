import axios from 'axios';
import { Quiz, RecentQuiz, LeaderboardEntry } from '../types';

// const API_BASE_URL = 'https://quiz-server-make.onrender.com/api';
const API_BASE_URL = 'https://quizserverfire-production.up.railway.app/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const api = {
  createQuiz: async (data: {
    text: string;
    question_type: string;
    num_options: number;
    num_questions: number;
    include_flashcards: boolean;
    content_name: string;
    user_id: string;
  }) => {
    const response = await apiClient.post('/create_content', data);
    return response.data;
  },

  getQuiz: async (quizId: string): Promise<Quiz> => {
    const response = await apiClient.get<Quiz>(`/quiz/${quizId}`);
    return response.data;
  },

  getRecentQuizzes: async (): Promise<RecentQuiz[]> => {
    const response = await apiClient.get<RecentQuiz[]>('/recent');
    return response.data;
  },

  getUserQuizzes: async (userId: string): Promise<RecentQuiz[]> => {
    const response = await apiClient.get<RecentQuiz[]>(`/recent/user/${userId}`);
    return response.data;
  },

  getFlashcards: async (quizId: string) => {
    const response = await apiClient.get<{ quiz_id: string; flashcards: Quiz['flashcards'] }>(
      `/flashcards/${quizId}`
    );
    return response.data;
  },

  submitScore: async (data: { quizId: string; playerName: string; score: number }) => {
    const response = await apiClient.post('/submit_score', data);
    return response.data;
  },

  getLeaderboard: async (quizId: string): Promise<{ quiz_id: string; leaderboard: LeaderboardEntry[] }> => {
    const response = await apiClient.get<{ quiz_id: string; leaderboard: LeaderboardEntry[] }>(
      `/leaderboard/${quizId}`
    );
    return response.data;
  },
}; 
