import React from 'react';
import { 
    Container, Typography, Box, Button, Grid, 
    Card, CardContent, CardMedia, Paper 
} from '@mui/material';
import School from '@mui/icons-material/School';
import Assignment from '@mui/icons-material/Assignment';
import Quiz from '@mui/icons-material/Quiz';
import History from '@mui/icons-material/History';
import TrendingUp from '@mui/icons-material/TrendingUp';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const features = [
        { 
            title: 'Question Banks', 
            desc: 'Access unit-wise important questions, expected questions and previous year questions.',
            icon: <Assignment sx={{ fontSize: 40 }} />,
            color: '#1976d2',
            path: '/r23/sem3'
        },
        { 
            title: 'Mock Exams', 
            desc: 'Test your knowledge with our timer-based mock examination system.',
            icon: <Quiz sx={{ fontSize: 40 }} />,
            color: '#2e7d32',
            path: '/r23/sem3' // Or a dedicated mock exam list
        },
        { 
            title: 'Previous Papers', 
            desc: 'Download and view previous university examination question papers.',
            icon: <History sx={{ fontSize: 40 }} />,
            color: '#ed6c02',
            path: '/previous-papers'
        },
        { 
            title: 'Important Qs', 
            desc: 'Special collection of questions frequently asked in university exams.',
            icon: <TrendingUp sx={{ fontSize: 40 }} />,
            color: '#9c27b0',
            path: '/r23/sem3'
        }
    ];

    return (
        <Box>
            {/* Hero Section */}
            <Paper 
                elevation={0} 
                sx={{ 
                    py: 10, 
                    px: 4, 
                    mb: 6, 
                    borderRadius: 6, 
                    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', 
                    color: 'white',
                    textAlign: 'center'
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2, letterSpacing: -1 }}>
                        Your Ultimate Academic Companion
                    </Typography>
                    <Typography variant="h5" sx={{ opacity: 0.9, mb: 4, fontWeight: 300 }}>
                        All-in-one portal for Question Banks, Mock Exams, and Previous Year Papers. 
                        Tailored for R23 Regulation.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button 
                            variant="contained" 
                            size="large" 
                            color="secondary"
                            onClick={() => navigate('/r23/sem3')}
                            sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 'bold' }}
                        >
                            Explore Subjects
                        </Button>
                        <Button 
                            variant="outlined" 
                            size="large" 
                            color="inherit"
                            onClick={() => navigate('/about')}
                            sx={{ borderRadius: 3, px: 4, py: 1.5 }}
                        >
                            Learn More
                        </Button>
                    </Box>
                </Container>
            </Paper>

            <Container sx={{ mb: 8 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
                    What We Offer
                </Typography>
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card 
                                sx={{ 
                                    height: '100%', 
                                    textAlign: 'center', 
                                    p: 2, 
                                    borderRadius: 4,
                                    transition: 'transform 0.3s',
                                    '&:hover': { transform: 'translateY(-10px)' }
                                }}
                            >
                                <Box sx={{ 
                                    display: 'inline-flex', 
                                    p: 2, 
                                    borderRadius: '50%', 
                                    bgcolor: `${feature.color}15`, 
                                    color: feature.color,
                                    mb: 2
                                }}>
                                    {feature.icon}
                                </Box>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {feature.desc}
                                    </Typography>
                                </CardContent>
                                <Button 
                                    endIcon={<ArrowForward />} 
                                    onClick={() => navigate(feature.path)}
                                    sx={{ mt: 'auto', fontWeight: 'bold' }}
                                >
                                    Access Now
                                </Button>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Quick Stats Section */}
            <Box sx={{ bgcolor: 'rgba(25, 118, 210, 0.05)', py: 8, borderRadius: 6, mb: 8 }}>
                <Container>
                    <Grid container spacing={4} textAlign="center">
                        <Grid item xs={6} md={3}>
                            <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>500+</Typography>
                            <Typography variant="subtitle1" color="textSecondary">Questions</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>50+</Typography>
                            <Typography variant="subtitle1" color="textSecondary">Subjects</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>100+</Typography>
                            <Typography variant="subtitle1" color="textSecondary">Mock Exams</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>200+</Typography>
                            <Typography variant="subtitle1" color="textSecondary">Previous Papers</Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default Home;
