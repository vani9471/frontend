import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
    Container, Typography, Grid, Box, TextField, 
    InputAdornment, Skeleton, Alert 
} from '@mui/material';
import { Search } from '@mui/icons-material';
import axios from 'axios';
import SubjectCard from '../components/common/SubjectCard';

const SemesterPage = () => {
    const { reg, sem } = useParams();
    const semesterNumber = sem.replace('sem', '');
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchSubjects = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/subjects?regulation=${reg.toUpperCase()}&semester=${semesterNumber}`);
                setSubjects(res.data.data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError('Failed to load subjects. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchSubjects();
    }, [reg, sem]);

    const filteredSubjects = subjects.filter(subject => 
        subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Container sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                <Box>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                        {reg.toUpperCase()} - Semester {semesterNumber}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Explore subjects and study materials
                    </Typography>
                </Box>
                
                <TextField
                    placeholder="Search subjects..."
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ width: { xs: '100%', sm: 300 } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Grid container spacing={3}>
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map((n) => (
                        <Grid item xs={12} sm={6} md={4} key={n}>
                            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
                        </Grid>
                    ))
                ) : filteredSubjects.length > 0 ? (
                    filteredSubjects.map((subject) => (
                        <Grid item xs={12} sm={6} md={4} key={subject._id}>
                            <SubjectCard subject={subject} />
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography variant="h6" color="text.secondary">
                                No subjects found for this semester.
                            </Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default SemesterPage;
