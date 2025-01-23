import { Box } from '@mui/material';
import {
    Container, IconButton, Stack, Typography, Tooltip
} from '@mui/material';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

const logoStyle = {
    width: '150px',
    height: 'auto',
};

function Copyright() {
    return (
        <Typography variant="subtitle2" component="h2" color="text.secondary">
            {'Copyright © '}<strong style={{ color: '#0a66c2' }}>{"Aman's "}</strong>
            {new Date().getFullYear()}
        </Typography>
    );
}

export default function Footer() {
    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    pt: 1,
                }}
            >
                <Box
                    component="img"
                    src="Logo.png"
                    sx={{
                        ...logoStyle,
                        mb: { xs: 0, md: 0 },
                    }}
                    alt="logo"
                />
                <Stack
                    direction="row"
                    justifyContent="center"
                    spacing={1}
                    sx={{
                        color: 'text.secondary',
                        mb: { xs: 1, md: 0 },
                    }}
                >
                    <Tooltip title="GitHub">
                        <IconButton
                            color="primary"
                            onClick={() => window.open('https://github.com/amankrs21', '_blank', 'noopener,noreferrer')}
                            aria-label="GitHub"
                            sx={{ alignSelf: 'center' }}
                        >
                            <FacebookIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Twitter">
                        <IconButton
                            color="primary"
                            onClick={() => window.open('https://twitter.com/amankrs21', '_blank', 'noopener,noreferrer')}
                            aria-label="X"
                            sx={{ alignSelf: 'center' }}
                        >
                            <XIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="LinkedIn">
                        <IconButton
                            color="primary"
                            onClick={() => window.open('https://www.linkedin.com/in/amankrs21', '_blank', 'noopener,noreferrer')}
                            aria-label="LinkedIn"
                            sx={{ alignSelf: 'center' }}
                        >
                            <LinkedInIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Instagram">
                        <IconButton
                            color="primary"
                            onClick={() => window.open('https://www.instagram.com/amankrs21', '_blank', 'noopener,noreferrer')}
                            aria-label="LinkedIn"
                            sx={{ alignSelf: 'center' }}
                        >
                            <InstagramIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
                <Box
                    sx={{
                        mb: { xs: 2, md: 0 },
                    }}
                >
                    <Copyright />
                </Box>
            </Box>
        </Container>
    );
}