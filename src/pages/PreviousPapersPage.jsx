import React, { useState, useEffect } from 'react';
import { 
    Container, Typography, Box, Grid, Card, CardContent, 
    Button, TextField, InputAdornment, MenuItem, Select,
    FormControl, InputLabel, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Chip
} from '@mui/material';
import { Search, Download, FilterList, PictureAsPdf } from '@mui/icons-material';
import axios from 'axios';

const PreviousPapersPage = () => {
    const [papers, setPapers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [semFilter, setSemFilter] = useState('All');
    const [yearFilter, setYearFilter] = useState('All');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [pRes, sRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL || 'https://backend-1-x7ra.onrender.com'}/api/previous-papers`),
                    axios.get(`${import.meta.env.VITE_API_URL || 'https://backend-1-x7ra.onrender.com'}/api/subjects`)
                ]);
                setPapers(pRes.data.data);
                setSubjects(sRes.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredPapers = papers.filter(paper => {
        const subject = subjects.find(s => s._id === paper.subject);
        const matchesSearch = subject?.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             subject?.code.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSem = semFilter === 'All' || subject?.semester.toString() === semFilter;
        const matchesYear = yearFilter === 'All' || paper.year.toString() === yearFilter;
        
        return matchesSearch && matchesSem && matchesYear;
    });

    return (
        <Container sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    Previous Year Question Papers
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Download university examination papers for practice.
                </Typography>
            </Box>

            <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            placeholder="Search subjects..."
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Semester</InputLabel>
                            <Select
                                value={semFilter}
                                label="Semester"
                                onChange={(e) => setSemFilter(e.target.value)}
                            >
                                <MenuItem value="All">All Semesters</MenuItem>
                                {[3, 4, 5, 6, 7, 8].map(s => (
                                    <MenuItem key={s} value={s.toString()}>Sem {s}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Year</InputLabel>
                            <Select
                                value={yearFilter}
                                label="Year"
                                onChange={(e) => setYearFilter(e.target.value)}
                            >
                                <MenuItem value="All">All Years</MenuItem>
                                {[2024, 2023, 2022, 2021, 2020].map(y => (
                                    <MenuItem key={y} value={y.toString()}>{y}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" color="text.secondary">
                            Found {filteredPapers.length} results
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Semester</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Year/Type</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Downloads</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPapers.length > 0 ? filteredPapers.map((paper) => {
                            const subject = subjects.find(s => s._id === paper.subject);
                            return (
                                <TableRow key={paper._id} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <PictureAsPdf color="error" />
                                            <Box>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                    {subject?.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {subject?.code}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={`Sem ${subject?.semester}`} size="small" variant="outlined" />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{paper.year} {paper.month}</Typography>
                                        <Chip label={paper.type} size="small" color={paper.type === 'Regular' ? 'success' : 'warning'} sx={{ height: 20, fontSize: '0.7rem', mt: 0.5 }} />
                                    </TableCell>
                                    <TableCell>{paper.downloadCount}</TableCell>
                                    <TableCell align="right">
                                        <Button 
                                            variant="outlined" 
                                            size="small" 
                                            startIcon={<Download />}
                                            href={paper.fileUrl}
                                            target="_blank"
                                            sx={{ borderRadius: 2, textTransform: 'none' }}
                                        >
                                            Download
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        }) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                    <Typography color="text.secondary">No question papers found matching your filters.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default PreviousPapersPage;
