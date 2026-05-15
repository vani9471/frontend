import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Paper, Grid, MenuItem, TextField, Button, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    CircularProgress, Alert, Fab
} from '@mui/material';
import { AutoAwesome as GenerateIcon, Download as DownloadIcon } from '@mui/icons-material';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const SLOTS = [
    { start: '09:00', end: '10:00' },
    { start: '10:00', end: '11:00' },
    { start: '11:15', end: '12:15' },
    { start: '12:15', end: '13:15' },
    { start: '14:15', end: '15:15' },
    { start: '15:15', end: '16:15' },
];

const Timetables = () => {
    const [departments, setDepartments] = useState([]);
    const [selectedDept, setSelectedDept] = useState('');
    const [selectedSem, setSelectedSem] = useState(1);
    const [timetable, setTimetable] = useState(null);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://backend-1-x7ra.onrender.com')}/api/departments`, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
            });
            setDepartments(res.data.data);
            if (res.data.data.length > 0) setSelectedDept(res.data.data[0]._id);
        } catch (err) {
            setError('Failed to fetch departments');
        }
    };

    const fetchTimetable = async () => {
        if (!selectedDept) return;
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://backend-1-x7ra.onrender.com')}/api/timetables?department=${selectedDept}&semester=${selectedSem}`, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
            });
            setTimetable(res.data.data[0] || null);
        } catch (err) {
            setError('Failed to fetch timetable');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://backend-1-x7ra.onrender.com')}/api/timetables/generate`, {
                department: selectedDept,
                semester: selectedSem,
                section: 'A',
                academicYear: '2023-24'
            }, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
            });
            fetchTimetable();
        } catch (err) {
            setError(err.response?.data?.message || 'Generation failed');
        } finally {
            setGenerating(false);
        }
    };

    const downloadPDF = () => {
        const input = document.getElementById('timetable-grid');
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4'); // landscape
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Timetable_${selectedSem}.pdf`);
        });
    };

    const getSlotContent = (day, slot) => {
        if (!timetable) return null;
        return timetable.schedule.find(s => s.day === day && s.startTime === slot.start);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Timetable Grid</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button 
                        variant="contained" 
                        startIcon={generating ? <CircularProgress size={20} color="inherit" /> : <GenerateIcon />} 
                        onClick={handleGenerate}
                        disabled={generating}
                    >
                        {generating ? 'Generating...' : 'Auto-Generate'}
                    </Button>
                    <Button 
                        variant="outlined" 
                        startIcon={<DownloadIcon />} 
                        onClick={downloadPDF}
                        disabled={!timetable}
                    >
                        Export PDF
                    </Button>
                </Box>
            </Box>

            <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            select
                            label="Department"
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                        >
                            {departments.map((dept) => (
                                <MenuItem key={dept._id} value={dept._id}>{dept.name}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            select
                            label="Semester"
                            value={selectedSem}
                            onChange={(e) => setSelectedSem(e.target.value)}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                <MenuItem key={sem} value={sem}>Semester {sem}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button variant="contained" fullWidth onClick={fetchTimetable} size="large">
                            View Timetable
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
            ) : timetable ? (
                <TableContainer component={Paper} id="timetable-grid" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead sx={{ bgcolor: 'primary.main' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Time / Day</TableCell>
                                {DAYS.map(day => (
                                    <TableCell key={day} align="center" sx={{ color: 'white', fontWeight: 'bold' }}>{day}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {SLOTS.map((slot, index) => (
                                <TableRow key={index} hover>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>
                                        {slot.start} - {slot.end}
                                    </TableCell>
                                    {DAYS.map(day => {
                                        const content = getSlotContent(day, slot);
                                        return (
                                            <TableCell key={day} align="center" sx={{ height: 100, border: '1px solid #eee' }}>
                                                {content ? (
                                                    <Box>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                                                            {content.subject?.name}
                                                        </Typography>
                                                        <Typography variant="caption" display="block">
                                                            {content.faculty?.user?.name}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                            Room: {content.room?.roomNumber}
                                                        </Typography>
                                                    </Box>
                                                ) : (
                                                    <Typography variant="caption" sx={{ color: '#ccc' }}>Free</Typography>
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Box sx={{ textAlign: 'center', mt: 5, color: 'text.secondary' }}>
                    <Typography>No timetable found for this selection. Click "Auto-Generate" to create one.</Typography>
                </Box>
            )}
        </Box>
    );
};

export default Timetables;
