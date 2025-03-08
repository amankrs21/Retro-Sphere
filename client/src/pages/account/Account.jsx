import { Container, Typography } from "@mui/material";

import './Account.css';


// Account page component
export default function Account() {
    return (
        <Container maxWidth="lg" className="construction">
            <div>
                <Typography variant="h4" component="h1" fontWeight={600} color="primary" gutterBottom>
                    Sorry for the inconvenience, but this page is under construction.
                </Typography>
                <Typography variant="h6" component="p" color="textSecondary">
                    We are working hard to bring this feature to you. Please check back later 🫡.
                </Typography>
            </div>
        </Container>
    )
}
