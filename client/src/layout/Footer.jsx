import { Container, Divider } from "@mui/material";

export default function Footer() {
    return (
        <Container maxWidth='xl' style={{ position: 'fixed', height: '5vh', bottom: 0 }}>
            <Divider />
            <div style={{ textAlign: 'center' }}>
                <p style={{ marginTop: 2 }}>© 2021 - Retro</p>
            </div>
        </Container>
    )
}
