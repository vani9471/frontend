import React, { useState } from 'react';
import { 
    Container, Typography, Box, Grid, Paper, 
    TextField, Button, Divider, Alert 
} from '@mui/material';
import LocationOn from '@mui/icons-material/LocationOn';
import Phone from '@mui/icons-material/Phone';
import Email from '@mui/icons-material/Email';
import Send from '@mui/icons-material/Send';

const ContactPage = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <Container sx={{ py: 6 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 6 }}>
                Get In Touch
            </Typography>

            <Grid container spacing={6}>
                <Grid item xs={12} md={5}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>Contact Information</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Have questions about the portal or the department? Reach out to us.
                    </Typography>

                    <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Avatar sx={{ bgcolor: 'primary.main' }}><LocationOn /></Avatar>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Address</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Academic Block 4, CSE Department, <br/>
                                    Main Campus, Hyderabad, TS 500001
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Avatar sx={{ bgcolor: 'primary.main' }}><Phone /></Avatar>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Phone</Typography>
                                <Typography variant="body2" color="text.secondary">+91 40 1234 5678</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.main' }}><Email /></Avatar>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Email</Typography>
                                <Typography variant="body2" color="text.secondary">support.qbportal@college.edu</Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 4 }} />
                    
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Visit Us</Typography>
                    <Paper sx={{ height: 200, bgcolor: '#f0f0f0', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="body2" color="text.secondary">Google Maps Integration Placeholder</Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 3 }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>Send a Message</Typography>
                        {submitted && <Alert severity="success" sx={{ mb: 3 }}>Thank you! Your message has been sent.</Alert>}
                        
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Full Name" required variant="outlined" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Email Address" required type="email" variant="outlined" />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Subject" required variant="outlined" />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Message" required multiline rows={4} variant="outlined" />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button 
                                        type="submit" 
                                        variant="contained" 
                                        size="large" 
                                        fullWidth 
                                        startIcon={<Send />}
                                        sx={{ borderRadius: 2, py: 1.5 }}
                                    >
                                        Send Message
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ContactPage;
