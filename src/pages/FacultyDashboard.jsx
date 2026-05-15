import React, { useState, useEffect } from 'react';
import { 
    Container, Typography, Box, Grid, Paper, 
    Button, Tabs, Tab, List, ListItem, ListItemText, 
    ListItemIcon, IconButton, TextField, MenuItem,
    CircularProgress, Alert, Snackbar, Card, CardContent,
    Dialog, DialogTitle, DialogContent, DialogActions, Divider
} from '@mui/material';
import { 
    CloudUpload, PostAdd, HistoryEdu, AssignmentTurnedIn,
    Delete, Edit, CheckCircle, Add as AddIcon, Send as SendIcon
} from '@mui/icons-material';
import axios from 'axios';
import fileService from '../services/fileService';

const FacultyDashboard = () => {
    const [tabValue, setTabValue] = useState(0);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: 'success' });
    const [openSnackbar, setOpenSnackbar] = useState(false);
    
    // Mock Exam State
    const [showExamDialog, setShowExamDialog] = useState(false);
    const [newExam, setNewExam] = useState({ title: '', duration: 30, subject: '', questions: [] });
    const [currentQuestion, setCurrentQuestion] = useState({ content: '', options: ['', '', '', ''], correctAnswer: '', marks: 2, unit: 1 });

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://backend-1-x7ra.onrender.com')}/api/subjects`);
            setSubjects(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

    const handleUploadResource = async (type) => {
        if (!selectedFile || !selectedSubject) {
            setMessage({ text: 'Please select a subject and a file', type: 'error' });
            setOpenSnackbar(true);
            return;
        }

        setUploading(true);
        try {
            const result = await fileService.uploadFile(selectedFile);
            const token = JSON.parse(localStorage.getItem('user')).token;
            
            const endpoint = type === 'QB' ? '/api/subjects/' + selectedSubject : '/api/previous-papers';
            const payload = type === 'QB' ? { questionBankUrl: result.data.filePath } : { 
                subject: selectedSubject, 
                fileUrl: result.data.filePath,
                year: new Date().getFullYear(),
                type: 'Regular'
            };

            if (type === 'QB') {
                await axios.put(`${import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://backend-1-x7ra.onrender.com')}${endpoint}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://backend-1-x7ra.onrender.com')}${endpoint}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            setMessage({ text: `${type} added successfully!`, type: 'success' });
            setOpenSnackbar(true);
            setSelectedFile(null);
        } catch (err) {
            setMessage({ text: 'Operation failed', type: 'error' });
            setOpenSnackbar(true);
        } finally {
            setUploading(false);
        }
    };

    const addQuestionToExam = () => {
        if (!currentQuestion.content || !currentQuestion.correctAnswer) {
            alert('Please fill question and correct answer');
            return;
        }
        setNewExam({ ...newExam, questions: [...newExam.questions, currentQuestion] });
        setCurrentQuestion({ content: '', options: ['', '', '', ''], correctAnswer: '', marks: 2, unit: 1 });
    };

    const saveExam = async () => {
        if (newExam.questions.length === 0) {
            alert('Add at least one question');
            return;
        }
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            
            // 1. Create all questions first
            const questionIds = [];
            for (const q of newExam.questions) {
                const qRes = await axios.post(`${import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://backend-1-x7ra.onrender.com')}/api/questions`, { ...q, subject: selectedSubject }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                questionIds.push(qRes.data.data._id);
            }

            // 2. Create the exam
            await axios.post(`${import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://backend-1-x7ra.onrender.com')}/api/mock-exams`, {
                ...newExam,
                subject: selectedSubject,
                questions: questionIds,
                totalMarks: newExam.questions.length * 2
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage({ text: 'Mock Exam published successfully!', type: 'success' });
            setOpenSnackbar(true);
            setShowExamDialog(false);
            setNewExam({ title: '', duration: 30, subject: '', questions: [] });
        } catch (err) {
            alert('Failed to save exam');
        }
    };

    return (
        <Container sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Faculty Portal</Typography>
                    <Typography variant="h6" color="textSecondary">Welcome back! Manage your academic resources here.</Typography>
                </Box>
                <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main' }}>
                    {JSON.parse(localStorage.getItem('user'))?.name?.charAt(0)}
                </Avatar>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                        <Tabs 
                            orientation="vertical" 
                            value={tabValue} 
                            onChange={(e, v) => setTabValue(v)}
                            sx={{ borderRight: 1, borderColor: 'divider' }}
                        >
                            <Tab icon={<CloudUpload />} iconPosition="start" label="Resource Center" />
                            <Tab icon={<AssignmentTurnedIn />} iconPosition="start" label="Mock Exams" />
                        </Tabs>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={9}>
                    {tabValue === 0 && (
                        <Card sx={{ borderRadius: 3, p: 2 }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>Upload Resources</Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>Add Question Banks or Previous Papers for your students.</Typography>
                                
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <TextField 
                                            select fullWidth label="Select Subject" 
                                            value={selectedSubject} 
                                            onChange={(e) => setSelectedSubject(e.target.value)}
                                        >
                                            {subjects.map(s => <MenuItem key={s._id} value={s._id}>{s.name} ({s.code})</MenuItem>)}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Button variant="outlined" component="label" fullWidth sx={{ height: '56px' }}>
                                            {selectedFile ? selectedFile.name : 'Choose File (PDF/Excel)'}
                                            <input type="file" hidden onChange={handleFileChange} />
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Button 
                                                variant="contained" 
                                                startIcon={<CloudUpload />} 
                                                onClick={() => handleUploadResource('QB')}
                                                disabled={uploading}
                                            >
                                                Upload as Question Bank
                                            </Button>
                                            <Button 
                                                variant="contained" 
                                                color="secondary"
                                                startIcon={<HistoryEdu />} 
                                                onClick={() => handleUploadResource('Paper')}
                                                disabled={uploading}
                                            >
                                                Upload as Previous Paper
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    )}

                    {tabValue === 1 && (
                        <Card sx={{ borderRadius: 3, p: 2 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Mock Exams</Typography>
                                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowExamDialog(true)}>Create Online Exam</Button>
                                </Box>
                                <Alert severity="info">Create interactive exams with instant scoring for your students.</Alert>
                            </CardContent>
                        </Card>
                    )}
                </Grid>
            </Grid>

            {/* Mock Exam Builder Dialog */}
            <Dialog open={showExamDialog} onClose={() => setShowExamDialog(false)} fullWidth maxWidth="md">
                <DialogTitle sx={{ fontWeight: 'bold' }}>Create Online Mock Exam</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField fullWidth label="Exam Title" value={newExam.title} onChange={(e) => setNewExam({...newExam, title: e.target.value})} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth type="number" label="Duration (Mins)" value={newExam.duration} onChange={(e) => setNewExam({...newExam, duration: e.target.value})} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField select fullWidth label="Subject" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                                    {subjects.map(s => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)}
                                </TextField>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />
                        <Typography variant="h6" gutterBottom>Add MCQ Question ({newExam.questions.length} added)</Typography>
                        
                        <TextField fullWidth multiline rows={2} label="Question Text" value={currentQuestion.content} onChange={(e) => setCurrentQuestion({...currentQuestion, content: e.target.value})} sx={{ mb: 2 }} />
                        
                        <Grid container spacing={2}>
                            {currentQuestion.options.map((opt, i) => (
                                <Grid item xs={6} key={i}>
                                    <TextField 
                                        fullWidth label={`Option ${i+1}`} 
                                        value={opt} 
                                        onChange={(e) => {
                                            const newOpts = [...currentQuestion.options];
                                            newOpts[i] = e.target.value;
                                            setCurrentQuestion({...currentQuestion, options: newOpts});
                                        }} 
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        
                        <TextField 
                            select fullWidth label="Correct Answer" 
                            value={currentQuestion.correctAnswer} 
                            onChange={(e) => setCurrentQuestion({...currentQuestion, correctAnswer: e.target.value})}
                            sx={{ mt: 2 }}
                        >
                            {currentQuestion.options.map((opt, i) => <MenuItem key={i} value={opt}>{opt || `Option ${i+1}`}</MenuItem>)}
                        </TextField>

                        <Button variant="outlined" startIcon={<AddIcon />} onClick={addQuestionToExam} sx={{ mt: 2 }}>Add This Question</Button>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setShowExamDialog(false)}>Cancel</Button>
                    <Button variant="contained" color="success" startIcon={<SendIcon />} onClick={saveExam}>Publish Exam</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
                <Alert severity={message.type} sx={{ width: '100%' }}>{message.text}</Alert>
            </Snackbar>
        </Container>
    );
};

export default FacultyDashboard;


