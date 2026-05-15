import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const HomeNavbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm py-2">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center">
                    <Box 
                        sx={{ 
                            width: 35, 
                            height: 35, 
                            bgcolor: 'primary.main', 
                            borderRadius: 1, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            mr: 1
                        }}
                    >
                        <Typography variant="h6" color="white" sx={{ fontWeight: 'bold' }}>Q</Typography>
                    </Box>
                    QB Portal
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        
                        <NavDropdown title="Regulations" id="regulations-dropdown">
                            <NavDropdown.Header className="fw-bold text-primary">Regulation R23</NavDropdown.Header>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={Link} to="/r23/sem3">Semester 3</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/r23/sem4">Semester 4</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/r23/sem5">Semester 5</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/r23/sem6">Semester 6</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/r23/sem7">Semester 7</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/r23/sem8">Semester 8</NavDropdown.Item>
                        </NavDropdown>

                        <Nav.Link as={Link} to="/subjects">Subjects</Nav.Link>
                        <Nav.Link as={Link} to="/mock-exams">Mock Exams</Nav.Link>
                        <Nav.Link as={Link} to="/previous-papers">Previous Papers</Nav.Link>
                        {user && (user.role === 'teacher' || user.role === 'admin') && (
                            <Nav.Link as={Link} to="/faculty-dashboard" className="text-primary fw-bold">Faculty Portal</Nav.Link>
                        )}
                        <Nav.Link as={Link} to="/about">About</Nav.Link>
                        <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                    </Nav>
                    
                    <Nav className="ms-auto align-items-center gap-2">
                        {user ? (
                            <>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mr: 2 }}>
                                    Hi, {user.name}
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    color="error" 
                                    size="small" 
                                    onClick={handleLogout}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button 
                                    component={Link} 
                                    to="/login" 
                                    variant="outlined" 
                                    color="inherit" 
                                    size="small"
                                    sx={{ borderRadius: 2 }}
                                >
                                    Login
                                </Button>
                                <Button 
                                    component={Link} 
                                    to="/register" 
                                    variant="contained" 
                                    color="primary" 
                                    size="small"
                                    sx={{ borderRadius: 2 }}
                                >
                                    Register
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default HomeNavbar;
