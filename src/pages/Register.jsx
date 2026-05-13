import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { TextField, Typography, Box, Paper, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
    });
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const { name, email, password, role } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6} lg={5}>
                    <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                Create Account
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Register as a Teacher, Student, or Admin
                            </Typography>
                        </Box>

                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={onSubmit}>
                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    name="name"
                                    value={name}
                                    onChange={onChange}
                                    required
                                    variant="outlined"
                                />
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                    required
                                    variant="outlined"
                                />
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    required
                                    variant="outlined"
                                />
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Role"
                                    name="role"
                                    value={role}
                                    onChange={onChange}
                                    variant="outlined"
                                >
                                    <MenuItem value="student">Student</MenuItem>
                                    <MenuItem value="teacher">Teacher</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                </TextField>
                            </Box>
                            <Button variant="primary" type="submit" className="w-100 py-2 mb-3" style={{ borderRadius: '8px' }}>
                                Register
                            </Button>
                        </Form>

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2">
                                Already have an account? <Link to="/login">Login here</Link>
                            </Typography>
                        </Box>
                    </Paper>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
