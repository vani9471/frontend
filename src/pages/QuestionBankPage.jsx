import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
    Container, Typography, Box, Accordion, AccordionSummary, 
    AccordionDetails, Chip, List, ListItem, ListItemText, ListItemIcon,
    Divider, Grid, Paper, Tabs, Tab, Skeleton, Alert 
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HelpOutlined from '@mui/icons-material/HelpOutlined';
import Assignment from '@mui/icons-material/Assignment';
import Star from '@mui/icons-material/Star';
import axios from 'axios';

const QuestionBankPage = () => {
    const { code } = useParams();
    const [subject, setSubject] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch subject details
                const subRes = await axios.get(`${import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://backend-1-x7ra.onrender.com')}/api/subjects`);
                const currentSub = subRes.data.data.find(s => s.code === code);
                
                if (currentSub) {
                    setSubject(currentSub);
                    // Fetch questions for this subject
                    const qRes = await axios.get(`${import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://backend-1-x7ra.onrender.com')}/api/questions?subject=${currentSub._id}`);
                    setQuestions(qRes.data.data);
                } else {
                    setError('Subject not found.');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [code]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const filterQuestions = (unit, marks) => {
        return questions.filter(q => q.unit === unit && q.marks === marks);
    };

    const QuestionList = ({ unit, marks }) => {
        const filtered = filterQuestions(unit, marks);
        if (filtered.length === 0) return <Typography variant="body2" color="text.secondary">No questions available.</Typography>;
        
        return (
            <List>
                {filtered.map((q, index) => (
                    <React.Fragment key={q._id}>
                        <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                {q.type === 'Important' ? <Star color="warning" fontSize="small" /> : <HelpOutlined fontSize="small" />}
                            </ListItemIcon>
                            <ListItemText 
                                primary={`${index + 1}. ${q.content}`}
                                secondary={
                                    <Box sx={{ mt: 0.5, display: 'flex', gap: 1 }}>
                                        <Chip label={q.type} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                                    </Box>
                                }
                            />
                        </ListItem>
                        {index < filtered.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                ))}
            </List>
        );
    };

    if (loading) return (
        <Container sx={{ py: 4 }}>
            <Skeleton variant="text" width={300} height={60} />
            <Skeleton variant="rectangular" height={400} sx={{ mt: 4, borderRadius: 3 }} />
        </Container>
    );

    if (error) return (
        <Container sx={{ py: 4 }}>
            <Alert severity="error">{error}</Alert>
        </Container>
    );

    return (
        <Container sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    {subject.name} ({subject.code})
                </Typography>
                <Typography variant="h6" color="primary">
                    Question Bank
                </Typography>
            </Box>

            <Paper sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
                <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange} 
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab label="2 Marks" icon={<HelpOutlined />} iconPosition="start" />
                    <Tab label="5 Marks" icon={<Assignment />} iconPosition="start" />
                    <Tab label="10 Marks" icon={<Star />} iconPosition="start" />
                </Tabs>
                
                <Box sx={{ p: 3 }}>
                    {[1, 2, 3, 4, 5].map((unit) => (
                        <Accordion key={unit} sx={{ mb: 1, '&:before': { display: 'none' }, boxShadow: 'none', border: '1px solid #eee' }}>
                            <AccordionSummary expandMore={<ExpandMore />}>
                                <Typography sx={{ fontWeight: 'bold' }}>Unit {unit}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <QuestionList unit={unit} marks={tabValue === 0 ? 2 : tabValue === 1 ? 5 : 10} />
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            </Paper>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom color="error.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Star /> Important Questions
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Consolidated list of most frequently asked and critical topics.
                        </Typography>
                        <List dense>
                            {questions.filter(q => q.type === 'Important').slice(0, 5).map((q, i) => (
                                <ListItem key={i}><ListItemText primary={q.content} /></ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Assignment /> Expected Questions
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Based on current syllabus trends and weightage analysis.
                        </Typography>
                        <List dense>
                            {questions.filter(q => q.type === 'Expected').slice(0, 5).map((q, i) => (
                                <ListItem key={i}><ListItemText primary={q.content} /></ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default QuestionBankPage;
