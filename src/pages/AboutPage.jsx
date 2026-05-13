import React from 'react';
import { Container, Typography, Box, Grid, Paper, Avatar, Divider } from '@mui/material';
import School from '@mui/icons-material/School';
import WorkspacePremium from '@mui/icons-material/WorkspacePremium';
import Computer from '@mui/icons-material/Computer';
import Groups from '@mui/icons-material/Groups';

const AboutPage = () => {
    return (
        <Container sx={{ py: 6 }}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Department of Computer Science & Engineering
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
                    Nurturing next-generation technology leaders through excellence in education, 
                    research, and innovation.
                </Typography>
            </Box>

            <Grid container spacing={4} sx={{ mb: 8 }}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 4, height: '100%', borderRadius: 4, bgcolor: 'primary.main', color: 'white' }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>Vision</Typography>
                        <Typography variant="body1">
                            To be a center of excellence in computer science education and research, 
                            fostering graduates who are technologically proficient and socially responsible 
                            to meet the global challenges.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 4, height: '100%', borderRadius: 4, border: '1px solid', borderColor: 'primary.main' }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>Mission</Typography>
                        <Typography variant="body1">
                            • Provide quality education through state-of-the-art infrastructure and faculty.<br/>
                            • Encourage research and innovation through industry-institute collaboration.<br/>
                            • Imbibe ethical values and leadership qualities in students.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>Academic Excellence</Typography>
            <Grid container spacing={3}>
                {[
                    { title: 'Modern Labs', icon: <Computer color="primary" />, desc: 'Fully equipped labs with high-end systems and high-speed internet.' },
                    { title: 'Expert Faculty', icon: <Groups color="primary" />, desc: 'Distinguished faculty with rich experience in academia and industry.' },
                    { title: 'Certifications', icon: <WorkspacePremium color="primary" />, desc: 'Integration with global certification programs from Cisco, AWS, and Oracle.' },
                    { title: 'Placement Record', icon: <School color="primary" />, desc: 'Consistently high placement rate with top-tier tech companies.' }
                ].map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Paper sx={{ p: 3, textAlign: 'center', height: '100%', borderRadius: 3, transition: '0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                            <Box sx={{ mb: 2 }}>{item.icon}</Box>
                            <Typography variant="h6" gutterBottom>{item.title}</Typography>
                            <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default AboutPage;
