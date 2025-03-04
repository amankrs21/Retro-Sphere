import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import {
    AppBar, Toolbar, Collapse, Typography, Container, Button, Tooltip, MenuItem,
    IconButton, Menu, Avatar
} from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import ReviewsIcon from '@mui/icons-material/Reviews';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import './Header.css';
import { useAuth } from '../hooks/useAuth';
import LogoutPop from '../components/LogoutPop';


// Header component
export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const { userData } = useAuth();
    const [open, setOpen] = useState(false);
    const [popUser, setPopUser] = useState(null);
    const [openLogout, setOpenLogout] = useState(false);

    const isActive = (page) => location.pathname.split('/')[1] === page;

    const toggleDrawer = (page) => {
        setOpen(!open);
        if (page) {
            navigate('/' + page);
        }
    };

    const handleOpenUserMenu = (event) => {
        setPopUser(event.currentTarget);
    };

    const handleCloseUserMenu = (setting) => {
        setPopUser(null);
        if (setting === 'logout') setOpenLogout(true);
    };

    return (
        <AppBar position="fixed">
            {openLogout && <LogoutPop openLogout={openLogout} setOpenLogout={setOpenLogout} />}
            <Container maxWidth="xl">
                <Toolbar disableGutters variant="dense">
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' } }} />
                    <Typography noWrap variant="h6" sx={{ display: { xs: 'none', md: 'flex' } }}>
                        &nbsp;Retro Sphere
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} ml={3}>
                        <MenuItem onClick={() => navigate('/home')} className={isActive('home') ? "active-route" : "non-active-route"}>
                            <HomeIcon />&nbsp;<Typography variant="body1">Home</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => navigate('/group')} className={isActive('group') ? "active-route" : "non-active-route"}>
                            <GroupIcon />&nbsp;<Typography variant="body1">Group</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => navigate('/retro')} className={isActive('retro') ? "active-route" : "non-active-route"}>
                            <ReviewsIcon />&nbsp;<Typography variant="body1">Retro-Board</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => navigate('/account')} className={isActive('account') ? "active-route" : "non-active-route"}>
                            <AccountCircleIcon />&nbsp;<Typography variant="body1">Account</Typography>
                        </MenuItem>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <Button
                            variant="outlined"
                            onClick={() => toggleDrawer()}
                            sx={{ minWidth: '30px', p: '4px' }}
                        >
                            {!open ? <MenuIcon sx={{ color: 'white' }} /> : <CloseIcon sx={{ color: 'white' }} />}
                        </Button>
                    </Box>

                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' } }} />
                    <Typography noWrap variant="h5" sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1 }}>
                        &nbsp;Retro Sphere
                    </Typography>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="User Profile" arrow>
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt={userData?.name} src={userData?.image} className='profileAvt' />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={popUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(popUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={() => handleCloseUserMenu("logout")}>
                                <Typography sx={{ display: 'flex', textAlign: 'center', fontWeight: 600 }}>
                                    Logout &nbsp; <LogoutIcon color='secondary' />
                                </Typography>
                            </MenuItem>
                        </Menu>
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
                            mb: 2,
                        }}
                    >
                        <MenuItem onClick={() => toggleDrawer('home')} className={isActive('home') ? "pop-active" : "pop-non-active"}>
                            <HomeIcon />&nbsp;<Typography variant="body1" fontWeight={800}>Home</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => toggleDrawer('group')} className={isActive('group') ? "pop-active" : "pop-non-active"}>
                            <GroupIcon />&nbsp;<Typography variant="body1" fontWeight={800}>Group</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => toggleDrawer('retro')} className={isActive('retro') ? "pop-active" : "pop-non-active"}>
                            <ReviewsIcon />&nbsp;<Typography variant="body1" fontWeight={800}>Retro-Board</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => toggleDrawer('account')} className={isActive('account') ? "pop-active" : "pop-non-active"}>
                            <AccountCircleIcon />&nbsp;<Typography variant="body1" fontWeight={800}>Account</Typography>
                        </MenuItem>
                    </Box>
                </Collapse>
            </Container>
        </AppBar>
    );
}
