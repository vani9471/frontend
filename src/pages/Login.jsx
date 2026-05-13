import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { TextField, Typography, Box, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6} lg={5}>
                    <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                Welcome Back
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Please login to your account
                            </Typography>
                        </Box>

                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={onSubmit}>
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
                            <Button variant="primary" type="submit" className="w-100 py-2 mb-3" style={{ borderRadius: '8px' }}>
                                Login
                            </Button>
                        </Form>

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2">
                                Don't have an account? <Link to="/register">Register here</Link>
                            </Typography>
                        </Box>
                    </Paper>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
