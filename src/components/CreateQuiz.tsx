import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Fade,
  Grow,
  Zoom,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Create as CreateIcon,
  Help as HelpIcon,
  ArrowBack as BackIcon,
  Send as SendIcon,
  School as SchoolIcon,
  QuestionAnswer as QuestionIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { api } from '../services/api';

interface CreateQuizResponse {
  quiz_id: string;
}

const CreateQuiz = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    text: '',
    content_name: '',
    question_type: 'multiple_choice',
    num_options: 4,
    num_questions: 5,
    include_flashcards: false,
  });

  // Animation effect when component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  const steps = ['Quiz Details', 'Content', 'Question Settings'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.createQuiz({ ...formData, user_id: user!.id }) as CreateQuizResponse;
      navigate(`/quiz/${response.quiz_id}`);
    } catch (err) {
      setError('Failed to create quiz. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name?: string; value: unknown; type?: string; checked?: boolean; } }) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name as string]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Fade in={activeStep === 0} timeout={500}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CreateIcon sx={{ fontSize: 30, mr: 2, color: 'primary.main' }} />
                <Typography variant="h5" color="primary">Quiz Details</Typography>
              </Box>
              
              <TextField
                fullWidth
                label="Quiz Name"
                name="content_name"
                value={formData.content_name}
                onChange={handleChange}
                required
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                      borderWidth: '2px',
                    },
                  },
                }}
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />
            </Box>
          </Fade>
        );
      case 1:
        return (
          <Fade in={activeStep === 1} timeout={500}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SchoolIcon sx={{ fontSize: 30, mr: 2, color: 'primary.main' }} />
                <Typography variant="h5" color="primary">Content</Typography>
              </Box>
              
              <TextField
                fullWidth
                label="Content Text"
                name="text"
                value={formData.text}
                onChange={handleChange}
                required
                multiline
                rows={6}
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                      borderWidth: '2px',
                    },
                  },
                }}
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
                placeholder="Enter the content from which questions will be generated..."
              />
            </Box>
          </Fade>
        );
      case 2:
        return (
          <Fade in={activeStep === 2} timeout={500}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SettingsIcon sx={{ fontSize: 30, mr: 2, color: 'primary.main' }} />
                <Typography variant="h5" color="primary">Question Settings</Typography>
              </Box>
              
              <FormControl 
                fullWidth 
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                      borderWidth: '2px',
                    },
                  },
                }}
              >
                <InputLabel>Question Type</InputLabel>
                <Select
                  name="question_type"
                  value={formData.question_type}
                  onChange={handleChange}
                  label="Question Type"
                >
                  <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
                  <MenuItem value="true_false">True/False</MenuItem>
                  <MenuItem value="mix">Mixed</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                  type="number"
                  label="Number of Questions"
                  name="num_questions"
                  value={formData.num_questions}
                  onChange={handleChange}
                  inputProps={{ min: 1, max: 10 }}
                  sx={{ 
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />

                <TextField
                  type="number"
                  label="Options per Question"
                  name="num_options"
                  value={formData.num_options}
                  onChange={handleChange}
                  inputProps={{ min: 2, max: 4 }}
                  sx={{ 
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      },
                    },
                  }}
                  disabled={formData.question_type === 'true_false'}
                />
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.include_flashcards}
                    onChange={handleChange}
                    name="include_flashcards"
                    sx={{
                      color: 'primary.main',
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography>Include Flashcards</Typography>
                    <Tooltip title="Generate flashcards to help with studying the content" arrow>
                      <IconButton size="small">
                        <HelpIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
                sx={{ mb: 3 }}
              />
            </Box>
          </Fade>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md">
      <Box 
        sx={{ 
          py: 4,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        <Paper 
          elevation={6} 
          sx={{ 
            p: 4, 
            borderRadius: 4,
            background: 'linear-gradient(to bottom right, #ffffff, #f5f5f5)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden',
          }}
          className="shadow-lg"
        >
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              height: '5px', 
              background: 'linear-gradient(90deg, #2196f3, #21cbf3)' 
            }} 
          />
          
          <Typography 
            variant="h4" 
            gutterBottom 
            color="primary" 
            align="center"
            sx={{ 
              mb: 4,
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Create New Quiz
          </Typography>

          {error && (
            <Zoom in={!!error}>
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            </Zoom>
          )}

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit}>
            {getStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0}
                startIcon={<BackIcon />}
                sx={{ 
                  borderRadius: 30,
                  px: 3,
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                  }
                }}
              >
                Back
              </Button>
              
              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    endIcon={loading ? undefined : <SendIcon />}
                    sx={{ 
                      borderRadius: 30,
                      px: 3,
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      boxShadow: '0 4px 8px rgba(33, 150, 243, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 12px rgba(33, 150, 243, 0.4)',
                      }
                    }}
                    className="btn-ripple"
                  >
                    {loading ? <CircularProgress size={24} /> : 'Create Quiz'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    endIcon={<QuestionIcon />}
                    sx={{ 
                      borderRadius: 30,
                      px: 3,
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      boxShadow: '0 4px 8px rgba(33, 150, 243, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 12px rgba(33, 150, 243, 0.4)',
                      }
                    }}
                    className="btn-ripple"
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateQuiz; 