import React from 'react';
import { Box, Container } from '@mui/material';
import Sidebar from './Sidebar';
import HomeNavbar from './HomeNavbar';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();
    
    // Management paths that need a sidebar
    const managementPaths = ['/departments', '/faculty', '/rooms', '/timetables'];
    const showSidebar = managementPaths.some(path => location.pathname.startsWith(path));

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <HomeNavbar />
            <Box sx={{ display: 'flex', flexGrow: 1 }}>
                {showSidebar && <Sidebar />}
                <Box 
                    component="main" 
                    sx={{ 
                        flexGrow: 1, 
                        p: 3, 
                        width: '100%',
                        bgcolor: 'rgba(0,0,0,0.02)'
                    }}
                >
                    <Container maxWidth="xl">
                        {children}
                    </Container>
                </Box>
            </Box>
        </Box>
    );
};

export default Layout;
