import React from 'react';
import { 
    Card, CardContent, Typography, CardActions, 
    Button, Box, Chip, Tooltip 
} from '@mui/material';
import Book from '@mui/icons-material/Book';
import Assignment from '@mui/icons-material/Assignment';
import Quiz from '@mui/icons-material/Quiz';
import History from '@mui/icons-material/History';
import { useNavigate } from 'react-router-dom';

const SubjectCard = ({ subject }) => {
    const navigate = useNavigate();

    return (
        <Card 
            sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                },
                borderRadius: 3
            }}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Chip 
                        label={`Sem ${subject.semester}`} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                    />
                    <Typography variant="caption" color="text.secondary">
                        {subject.code}
                    </Typography>
                </Box>
                
                <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {subject.name}
                </Typography>
            </CardContent>
            
            <CardActions sx={{ flexDirection: 'column', gap: 1, p: 2, pt: 0 }}>
                <Button 
                    fullWidth 
                    variant="contained" 
                    startIcon={<Book />}
                    onClick={() => navigate(`/subject/${subject.code}/qb`)}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                    Open Question Bank
                </Button>
                
                <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                    <Button 
                        fullWidth 
                        variant="outlined" 
                        size="small"
                        startIcon={<Quiz />}
                        onClick={() => navigate(`/subject/${subject.code}/mock`)}
                        sx={{ textTransform: 'none', borderRadius: 2 }}
                    >
                        Mock Exam
                    </Button>
                    <Button 
                        fullWidth 
                        variant="outlined" 
                        size="small"
                        startIcon={<History />}
                        onClick={() => navigate(`/previous-papers?subject=${subject.code}`)}
                        sx={{ textTransform: 'none', borderRadius: 2 }}
                    >
                        Papers
                    </Button>
                </Box>
            </CardActions>
        </Card>
    );
};

export default SubjectCard;
