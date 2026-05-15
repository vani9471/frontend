import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Grid, Card, CardContent, CardActions, 
    Button, IconButton, TextField, InputAdornment, Dialog, 
    DialogTitle, DialogContent, DialogActions, Fab, Tooltip,
    Avatar, Chip, Stack, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { 
    Add as AddIcon, 
    Search as SearchIcon, 
    Edit as EditIcon, 
    Delete as DeleteIcon, 
    Business as DeptIcon,
    GridView as GridIcon,
    List as ListIcon,
    School as SchoolIcon,
    Groups as FacultyIcon
} from '@mui/icons-material';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [view, setView] = useState('grid');
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentDept, setCurrentDept] = useState({ name: '', code: '', description: '' });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/departments`, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
            });
            setDepartments(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            if (editMode) {
                await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/departments/${currentDept._id}`, currentDept, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/departments`, currentDept, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setOpen(false);
            fetchDepartments();
            setCurrentDept({ name: '', code: '', description: '' });
        } catch (err) {
            alert('Failed to save department');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/departments/${id}`, {
                    headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
                });
                fetchDepartments();
            } catch (err) {
                alert('Failed to delete department');
            }
        }
    };

    const filteredDepts = departments.filter(d => 
        d.name.toLowerCase().includes(search.toLowerCase()) || 
        d.code.toLowerCase().includes(search.toLowerCase())
    );

    const columns = [
        { field: 'code', headerName: 'Code', width: 120 },
        { field: 'name', headerName: 'Department Name', width: 250 },
        { field: 'description', headerName: 'Description', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Box>
                    <IconButton onClick={() => { setCurrentDept(params.row); setEditMode(true); setOpen(true); }}><EditIcon color="primary" /></IconButton>
                    <IconButton onClick={() => handleDelete(params.row._id)}><DeleteIcon color="error" /></IconButton>
                </Box>
            )
        }
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Department Management</Typography>
                <Stack direction="row" spacing={2}>
                    <ToggleButtonGroup
                        value={view}
                        exclusive
                        onChange={(e, next) => next && setView(next)}
                        size="small"
                    >
                        <ToggleButton value="grid"><GridIcon /></ToggleButton>
                        <ToggleButton value="list"><ListIcon /></ToggleButton>
                    </ToggleButtonGroup>
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />} 
                        onClick={() => { setCurrentDept({ name: '', code: '', description: '' }); setEditMode(false); setOpen(true); }}
                    >
                        Add New
                    </Button>
                </Stack>
            </Box>

            <TextField
                fullWidth
                placeholder="Search departments by name or code..."
                variant="outlined"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 4, bgcolor: 'white' }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" />
                        </InputAdornment>
                    ),
                }}
            />

            {view === 'grid' ? (
                <Grid container spacing={3}>
                    {filteredDepts.map((dept) => (
                        <Grid item xs={12} sm={6} md={4} key={dept._id}>
                            <Card sx={{ 
                                borderRadius: 3, 
                                transition: 'transform 0.2s', 
                                '&:hover': { transform: 'scale(1.02)', boxShadow: 6 } 
                            }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                                            <DeptIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{dept.name}</Typography>
                                            <Typography variant="body2" color="textSecondary">Code: {dept.code}</Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" sx={{ mb: 2, height: 40, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {dept.description || 'No description provided.'}
                                    </Typography>
                                    <Stack direction="row" spacing={1}>
                                        <Chip icon={<FacultyIcon fontSize="small" />} label="12 Faculty" size="small" variant="outlined" />
                                        <Chip icon={<SchoolIcon fontSize="small" />} label="8 Courses" size="small" variant="outlined" />
                                    </Stack>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'flex-end', bgcolor: '#fcfcfc', px: 2 }}>
                                    <IconButton size="small" onClick={() => { setCurrentDept(dept); setEditMode(true); setOpen(true); }}><EditIcon fontSize="small" color="primary" /></IconButton>
                                    <IconButton size="small" onClick={() => handleDelete(dept._id)}><DeleteIcon fontSize="small" color="error" /></IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Paper sx={{ height: 500, width: '100%', borderRadius: 3, overflow: 'hidden' }}>
                    <DataGrid
                        rows={filteredDepts}
                        columns={columns}
                        getRowId={(row) => row._id}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        disableSelectionOnClick
                        loading={loading}
                    />
                </Paper>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{editMode ? 'Edit Department' : 'Add New Department'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Department Name"
                            value={currentDept.name}
                            onChange={(e) => setCurrentDept({ ...currentDept, name: e.target.value })}
                            sx={{ mb: 3 }}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Department Code (e.g., CS)"
                            value={currentDept.code}
                            onChange={(e) => setCurrentDept({ ...currentDept, code: e.target.value })}
                            sx={{ mb: 3 }}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            multiline
                            rows={3}
                            value={currentDept.description}
                            onChange={(e) => setCurrentDept({ ...currentDept, description: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>{editMode ? 'Update' : 'Create'}</Button>
                </DialogActions>
            </Dialog>

            <Fab 
                color="primary" 
                aria-label="add" 
                sx={{ position: 'fixed', bottom: 32, right: 32 }}
                onClick={() => { setCurrentDept({ name: '', code: '', description: '' }); setEditMode(false); setOpen(true); }}
            >
                <AddIcon />
            </Fab>
        </Box>
    );
};

export default Departments;
