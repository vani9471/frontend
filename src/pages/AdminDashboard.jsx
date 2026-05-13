import React, { useState } from 'react';
import { 
    Container, Typography, Box, Grid, Paper, 
    Button, Tabs, Tab, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, IconButton, 
    Chip, Avatar
} from '@mui/material';
import Dashboard from '@mui/icons-material/Dashboard';
import People from '@mui/icons-material/People';
import Book from '@mui/icons-material/Book';
import Quiz from '@mui/icons-material/Quiz';
import Assessment from '@mui/icons-material/Assessment';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import AddCircle from '@mui/icons-material/AddCircle';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';

const AdminDashboard = () => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Container sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <AdminPanelSettings sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Admin Dashboard</Typography>
                    <Typography variant="h6" color="textSecondary">System Management & Analytics</Typography>
                </Box>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 4, bgcolor: 'primary.main', color: 'white' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>1,240</Typography>
                        <Typography variant="body2">Total Users</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 4, bgcolor: 'success.main', color: 'white' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>45</Typography>
                        <Typography variant="body2">Active Subjects</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 4, bgcolor: 'warning.main', color: 'white' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>850</Typography>
                        <Typography variant="body2">Questions</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 4, bgcolor: 'error.main', color: 'white' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>12</Typography>
                        <Typography variant="body2">Faculty Members</Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab icon={<Dashboard />} iconPosition="start" label="Overview" />
                    <Tab icon={<People />} iconPosition="start" label="Users" />
                    <Tab icon={<Book />} iconPosition="start" label="Subjects" />
                    <Tab icon={<Quiz />} iconPosition="start" label="Exams" />
                    <Tab icon={<Assessment />} iconPosition="start" label="Analytics" />
                </Tabs>

                <Box sx={{ p: 4 }}>
                    {tabValue === 0 && (
                        <Box>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Recent Activity</Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Action</TableCell>
                                            <TableCell>User</TableCell>
                                            <TableCell>Entity</TableCell>
                                            <TableCell>Time</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {[
                                            { action: 'Created Question', user: 'Dr. Smith', entity: 'DBMS', time: '10 mins ago' },
                                            { action: 'Registered', user: 'John Doe', entity: 'Student', time: '1 hour ago' },
                                            { action: 'Uploaded Paper', user: 'Admin', entity: 'OS - 2023', time: '3 hours ago' },
                                        ].map((row, i) => (
                                            <TableRow key={i}>
                                                <TableCell><Chip label={row.action} size="small" variant="outlined" /></TableCell>
                                                <TableCell>{row.user}</TableCell>
                                                <TableCell>{row.entity}</TableCell>
                                                <TableCell>{row.time}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}

                    {tabValue === 1 && (
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>User Management</Typography>
                                <Button variant="contained" startIcon={<AddCircle />}>Add User</Button>
                            </Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>User</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Role</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {[
                                            { name: 'Admin User', email: 'admin@gvani.edu', role: 'Admin' },
                                            { name: 'Prof. Sharma', email: 'sharma@gvani.edu', role: 'Faculty' },
                                            { name: 'Alice Johnson', email: 'alice@student.edu', role: 'Student' },
                                        ].map((user, i) => (
                                            <TableRow key={i}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Avatar sx={{ width: 24, height: 24 }}>{user.name[0]}</Avatar>
                                                        {user.name}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={user.role} 
                                                        size="small" 
                                                        color={user.role === 'Admin' ? 'error' : user.role === 'Faculty' ? 'warning' : 'primary'} 
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton size="small"><Edit fontSize="small" /></IconButton>
                                                    <IconButton size="small" color="error"><Delete fontSize="small" /></IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}

                    {(tabValue === 2 || tabValue === 3 || tabValue === 4) && (
                        <Box sx={{ py: 4, textAlign: 'center' }}>
                            <Typography color="textSecondary">Manage {tabValue === 2 ? 'Subjects' : tabValue === 3 ? 'Exams' : 'Analytics'} module content here.</Typography>
                            <Button variant="outlined" sx={{ mt: 2 }}>Launch Management Module</Button>
                        </Box>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default AdminDashboard;
