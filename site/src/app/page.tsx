import { Container, Divider } from '@mui/material';
import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';

// 100% static
export const revalidate = false;

export default function Home() {
    return (
        <Container component='main'>
            <Hero />

            <Divider />

            <Features />
        </Container>
    );
}
