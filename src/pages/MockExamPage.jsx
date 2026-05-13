import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Container, Typography, Box, Paper, Button, Radio, 
    RadioGroup, FormControlLabel, FormControl, FormLabel,
    LinearProgress, Grid, Divider, Alert, CircularProgress
} from '@mui/material';
import Timer from '@mui/icons-material/Timer';
import Send from '@mui/icons-material/Send';
import Replay from '@mui/icons-material/Replay';
import ListAlt from '@mui/icons-material/ListAlt';
import axios from 'axios';

const MockExamPage = () => {
    const { code } = useParams();
    const navigate = useNavigate();
    const [subject, setSubject] = useState(null);
    const [mockExam, setMockExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const subRes = await axios.get(`http://localhost:5000/api/subjects`);
                const currentSub = subRes.data.data.find(s => s.code === code);
                
                if (currentSub) {
                    setSubject(currentSub);
                    // Fetch mock exam for this subject
                    const examRes = await axios.get(`http://localhost:5000/api/mock-exams?subject=${currentSub._id}`);
                    if (examRes.data.data.length > 0) {
                        const exam = examRes.data.data[0];
                        setMockExam(exam);
                        setQuestions(exam.questions);
                        setTimeLeft(exam.duration * 60);
                    } else {
                        // Fallback: fetch random MCQ questions
                        const qRes = await axios.get(`http://localhost:5000/api/questions?subject=${currentSub._id}`);
                        const mcqs = qRes.data.data.filter(q => q.options && q.options.length > 0);
                        setQuestions(mcqs);
                        setTimeLeft(20 * 60); // 20 mins default
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [code]);

    useEffect(() => {
        if (timeLeft > 0 && !isFinished) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !isFinished && questions.length > 0) {
            handleSubmit();
        }
    }, [timeLeft, isFinished, questions]);

    const handleAnswer = (questionId, answer) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmit = async () => {
        setIsFinished(true);
        
        let score = 0;
        questions.forEach(q => {
            if (answers[q._id] === q.correctAnswer) {
                score++;
            }
        });

        const resultData = {
            score: (score / questions.length) * 100,
            totalQuestions: questions.length,
            correctAnswers: score,
            timeTaken: (mockExam?.duration * 60 || 1200) - timeLeft,
        };

        try {
            const examId = mockExam?._id || subject?._id;
            // Assuming we have a result model on backend
            await axios.post(`http://localhost:5000/api/mock-exams/${examId}/submit`, resultData);
            setResult(resultData);
        } catch (err) {
            console.error(err);
            setResult(resultData); // Show result locally even if saving fails
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (loading) return (
        <Container sx={{ py: 8, textAlign: 'center' }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Loading Exam...</Typography>
        </Container>
    );

    if (!questions.length) return (
        <Container sx={{ py: 8 }}>
            <Alert severity="info">No mock exams available for this subject yet.</Alert>
            <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate(-1)}>Go Back</Button>
        </Container>
    );

    if (isFinished && result) {
        return (
            <Container sx={{ py: 4, maxWidth: 600 }}>
                <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Exam Results</Typography>
                    <Divider sx={{ my: 3 }} />
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Score</Typography>
                            <Typography variant="h5" color="primary">{result.score.toFixed(1)}%</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Correct</Typography>
                            <Typography variant="h5">{result.correctAnswers} / {result.totalQuestions}</Typography>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 4, textAlign: 'left' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Performance Analysis</Typography>
                        <Alert severity={result.score >= 40 ? "success" : "warning"} sx={{ mt: 1 }}>
                            {result.score >= 70 ? "Excellent performance!" : 
                             result.score >= 40 ? "Good job, but some improvement needed." : 
                             "You need more practice on this subject."}
                        </Alert>
                    </Box>
                    <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                        <Button fullWidth variant="contained" onClick={() => window.location.reload()}>Try Again</Button>
                        <Button fullWidth variant="outlined" onClick={() => navigate('/')}>Home</Button>
                    </Box>
                </Paper>
            </Container>
        );
    }

    const q = questions[currentQuestion];

    return (
        <Container sx={{ py: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 4, borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Question {currentQuestion + 1} of {questions.length}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: timeLeft < 60 ? 'error.main' : 'primary.main' }}>
                                <Timer fontSize="small" />
                                <Typography sx={{ fontWeight: 'bold' }}>{formatTime(timeLeft)}</Typography>
                            </Box>
                        </Box>

                        <LinearProgress 
                            variant="determinate" 
                            value={((currentQuestion + 1) / questions.length) * 100} 
                            sx={{ mb: 4, height: 6, borderRadius: 3 }}
                        />

                        <FormControl component="fieldset" fullWidth>
                            <FormLabel component="legend" sx={{ fontSize: '1.2rem', color: 'text.primary', mb: 3, fontWeight: 500 }}>
                                {q.content}
                            </FormLabel>
                            <RadioGroup
                                value={answers[q._id] || ''}
                                onChange={(e) => handleAnswer(q._id, e.target.value)}
                            >
                                {q.options.map((option, i) => (
                                    <Paper 
                                        key={i} 
                                        variant="outlined" 
                                        sx={{ 
                                            mb: 1, 
                                            px: 2, 
                                            borderRadius: 2,
                                            borderColor: answers[q._id] === option ? 'primary.main' : '#eee',
                                            bgcolor: answers[q._id] === option ? 'rgba(25, 118, 210, 0.04)' : 'transparent'
                                        }}
                                    >
                                        <FormControlLabel 
                                            value={option} 
                                            control={<Radio />} 
                                            label={option} 
                                            sx={{ width: '100%', py: 1, m: 0 }}
                                        />
                                    </Paper>
                                ))}
                            </RadioGroup>
                        </FormControl>

                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                            <Button 
                                disabled={currentQuestion === 0}
                                onClick={() => setCurrentQuestion(prev => prev - 1)}
                            >
                                Previous
                            </Button>
                            {currentQuestion === questions.length - 1 ? (
                                <Button 
                                    variant="contained" 
                                    color="success" 
                                    startIcon={<Send />}
                                    onClick={handleSubmit}
                                >
                                    Submit Exam
                                </Button>
                            ) : (
                                <Button 
                                    variant="contained" 
                                    onClick={() => setCurrentQuestion(prev => prev + 1)}
                                >
                                    Next Question
                                </Button>
                            )}
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ListAlt /> Navigation
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={1}>
                            {questions.map((_, index) => (
                                <Grid item xs={3} key={index}>
                                    <Box 
                                        onClick={() => setCurrentQuestion(index)}
                                        sx={{ 
                                            width: '100%', 
                                            height: 40, 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            borderRadius: 1,
                                            cursor: 'pointer',
                                            border: '1px solid',
                                            borderColor: currentQuestion === index ? 'primary.main' : 
                                                        answers[questions[index]._id] ? 'success.light' : '#eee',
                                            bgcolor: currentQuestion === index ? 'primary.main' : 
                                                    answers[questions[index]._id] ? 'success.light' : 'transparent',
                                            color: currentQuestion === index || answers[questions[index]._id] ? 'white' : 'text.primary',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {index + 1}
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                                <Box component="span" sx={{ display: 'inline-block', width: 12, height: 12, bgcolor: 'success.light', mr: 1, borderRadius: '50%' }} />
                                Answered
                            </Typography>
                            <Typography variant="caption" display="block">
                                <Box component="span" sx={{ display: 'inline-block', width: 12, height: 12, bgcolor: 'primary.main', mr: 1, borderRadius: '50%' }} />
                                Current
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default MockExamPage;
