import { Container, Typography } from '@mui/material';

export default function NotFound() {
    return (
        <Container
            component='main'
            sx={{
                height: '100dvh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Typography fontWeight='bold' fontSize='4rem' textAlign='center'>
                404 - Not Found
            </Typography>
        </Container>
    );
}
