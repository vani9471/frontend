import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Drawer, Toolbar, Box, Divider } from '@mui/material';
import { 
    Dashboard as DashboardIcon, 
    Business as DeptIcon, 
    Book as SubjectIcon, 
    People as FacultyIcon, 
    MeetingRoom as RoomIcon, 
    CalendarMonth as TimetableIcon 
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Departments', icon: <DeptIcon />, path: '/departments' },
        { text: 'Subjects', icon: <SubjectIcon />, path: '/subjects' },
        { text: 'Faculty', icon: <FacultyIcon />, path: '/faculty' },
        { text: 'Rooms', icon: <RoomIcon />, path: '/rooms' },
        { text: 'Timetables', icon: <TimetableIcon />, path: '/timetables' },
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    {menuItems.map((item) => (
                        <ListItem 
                            button 
                            key={item.text} 
                            onClick={() => navigate(item.path)}
                            selected={location.pathname === item.path}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
                <Divider />
            </Box>
        </Drawer>
    );
};

export default Sidebar;
