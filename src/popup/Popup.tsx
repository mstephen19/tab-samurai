import { Box, Container, styled } from '@mui/material';
import { TopBar } from './TopBar';
import { Accordions } from './Accordions';
import { AppDataProvider } from './context/AppDataProvider';
import { ThemeProvider } from './context/ThemeProvider';
import { useCallback, useEffect, useRef } from 'react';
import { Toaster } from './Toast';
import { Welcome } from './Welcome';
import { Footer } from './Footer';
import { UpdateProvider } from './context/UpdateProvider';
import { UpdatePrompt } from './UpdatePrompt';
import { ReviewPrompt } from './ReviewPrompt';

const AppWrapper = styled(Box)(({ theme }) => ({
    height: '600px',
    width: '600px',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    ...theme.applyStyles('light', {
        background: theme.palette.primary.main,
    }),
}));

const AppContainer = styled(Container)({
    width: '100%',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflowY: 'scroll',
    overscrollBehavior: 'none',
});

function Popup() {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleLogoClick = useCallback(() => {
        containerRef.current?.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, []);

    useEffect(() => {
        window.resizeTo(600, 600);
        window.addEventListener('resize', () => window.resizeTo(600, 600));
    }, []);

    return (
        <AppDataProvider>
            <ThemeProvider>
                <AppWrapper>
                    <Welcome />

                    <UpdateProvider>
                        <UpdatePrompt />
                    </UpdateProvider>

                    {/* Display the "Leave a Review" prompt every 24 hours, until the prompt is accepted */}
                    <ReviewPrompt intervalMs={1_000 * 60 * 60 * 24} />

                    <Toaster filled position='bottom' />

                    <TopBar onLogoClick={handleLogoClick} />

                    <AppContainer disableGutters ref={containerRef}>
                        <Accordions />

                        <Footer />
                    </AppContainer>
                </AppWrapper>
            </ThemeProvider>
        </AppDataProvider>
    );
}

export default Popup;
