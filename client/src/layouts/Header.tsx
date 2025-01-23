import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import {
    AppBar, Toolbar, Button, Container, Typography, MenuItem, Collapse,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import CottageIcon from '@mui/icons-material/Cottage';
import DescriptionIcon from '@mui/icons-material/Description';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';

const logoStyle = {
    width: '140px',
    height: 'auto',
    cursor: 'pointer',
};

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const toggleDrawer = (page: string) => {
        setOpen(!open);
        if (page.length > 0) {
            navigate('/' + page);
        }
    };

    const isActive = (page: string) => location.pathname === '/' + page;

    return (
        <div>
            <AppBar
                position="fixed"
                sx={{
                    boxShadow: 0,
                    bgcolor: 'transparent',
                    backgroundImage: 'none',
                    mt: 1,
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar
                        variant="regular"
                        sx={{
                            maxHeight: 40,
                            flexShrink: 0,
                            display: 'flex',
                            border: '1px solid',
                            alignItems: 'center',
                            borderRadius: '999px',
                            borderColor: 'divider',
                            backdropFilter: 'blur(24px)',
                            justifyContent: 'space-between',
                            bgcolor: 'rgba(255, 255, 255, 0.4)',
                            boxShadow: `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                        }}
                    >
                        <img
                            src='Logo.png'
                            style={logoStyle}
                            alt="logo"
                        />
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: 'none', md: 'flex' },
                                justifyContent: 'flex-end',
                            }}
                        >
                            <MenuItem onClick={() => navigate('/')}>
                                <CottageIcon color={isActive('home') ? "primary" : "inherit"} />&nbsp;
                                <Typography variant="body1" fontWeight="bold" color={isActive('home') ? "primary" : "text.primary"}>
                                    Home
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={() => navigate('/about')}>
                                <PersonIcon color={isActive('about') ? "primary" : "inherit"} />&nbsp;
                                <Typography variant="body1" fontWeight="bold" color={isActive('about') ? "primary" : "text.primary"}>
                                    About
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={() => navigate('/project')}>
                                <DeveloperModeIcon color={isActive('project') ? "primary" : "inherit"} />&nbsp;
                                <Typography variant="body1" fontWeight="bold" color={isActive('project') ? "primary" : "text.primary"}>
                                    Project
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={() => navigate('/resume')}>
                                <DescriptionIcon color={isActive('resume') ? "primary" : "inherit"} />&nbsp;
                                <Typography variant="body1" fontWeight="bold" color={isActive('resume') ? "primary" : "text.primary"}>
                                    Resume
                                </Typography>
                            </MenuItem>
                        </Box>
                        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                            <Button
                                variant="text"
                                color="primary"
                                aria-label="menu"
                                onClick={() => toggleDrawer('')}
                                sx={{ minWidth: '30px', p: '4px' }}
                            >
                                {!open ? <MenuIcon /> : <CloseIcon />}
                            </Button>
                        </Box>
                    </Toolbar>
                    <Collapse in={open}>
                        <Box
                            sx={{
                                display: { xs: 'block', md: 'none' },
                                bgcolor: 'rgba(241, 241, 241, 0.9)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '20px',
                                textAlign: 'center',
                                p: 2,
                            }}
                        >
                            <MenuItem onClick={() => toggleDrawer('home')} sx={{ justifyContent: 'center', width: '100%' }}>
                                <CottageIcon color={isActive('home') ? "primary" : "inherit"} />&nbsp;
                                <Typography variant="body1" fontWeight="bold" color={isActive('home') ? "primary" : "text.primary"}>
                                    Home
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={() => toggleDrawer('about')} sx={{ justifyContent: 'center', width: '100%' }}>
                                <PersonIcon color={isActive('about') ? "primary" : "inherit"} />&nbsp;
                                <Typography variant="body1" fontWeight="bold" color={isActive('about') ? "primary" : "text.primary"}>
                                    About
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={() => toggleDrawer('project')} sx={{ justifyContent: 'center', width: '100%' }}>
                                <DeveloperModeIcon color={isActive('project') ? "primary" : "inherit"} />&nbsp;
                                <Typography variant="body1" fontWeight="bold" color={isActive('project') ? "primary" : "text.primary"}>
                                    Project
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={() => toggleDrawer('resume')} sx={{ justifyContent: 'center', width: '100%' }}>
                                <DescriptionIcon color={isActive('resume') ? "primary" : "inherit"} />&nbsp;
                                <Typography variant="body1" fontWeight="bold" color={isActive('resume') ? "primary" : "text.primary"}>
                                    Resume
                                </Typography>
                            </MenuItem>
                        </Box>
                    </Collapse>
                </Container>
            </AppBar>
        </div>
    );
}
