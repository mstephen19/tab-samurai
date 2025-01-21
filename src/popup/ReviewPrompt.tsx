import { useCallback, useContext, useEffect, useState } from 'react';
import { AppDataContext } from './context/AppDataProvider';
import { Backdrop, Button, Card, CardActions, CardContent, CardHeader, Rating, Typography } from '@mui/material';
import { store } from '../storage';
import { tabs } from '../utils';
import { REVIEW_EXTENSION_URL } from '../consts';

const openExtensionReviewPage = tabs.openUrl(REVIEW_EXTENSION_URL);

export const ReviewPrompt = ({ intervalMs }: { intervalMs: number }) => {
    const [open, setOpen] = useState(false);
    const appData = useContext(AppDataContext);

    useEffect(() => {
        // When accepted, it's assumed the extension was reviewed
        // and lastDismissedMs is set to -1
        if (appData.reviewPromptLastDismissedMs === -1) return;

        const timeSinceDismissal = Date.now() - appData.reviewPromptLastDismissedMs;
        const timeUntilPrompt = intervalMs - timeSinceDismissal;

        if (timeUntilPrompt <= 0) {
            setOpen(true);
            return;
        }

        const timeout = setTimeout(() => setOpen(true), timeUntilPrompt);

        return () => clearTimeout(timeout);
    }, [appData.reviewPromptLastDismissedMs, intervalMs]);

    const handleDismiss = useCallback(() => {
        setOpen(false);

        store.appData.write({
            ...appData,
            reviewPromptLastDismissedMs: Date.now(),
        });
    }, [appData]);

    const handleAccept = useCallback(() => {
        setOpen(false);

        store.appData.write({
            ...appData,
            reviewPromptLastDismissedMs: -1,
        });

        openExtensionReviewPage();
    }, [appData]);

    return (
        <Backdrop sx={{ zIndex: 2147483646 }} open={open}>
            <Card sx={{ padding: '10px' }}>
                <CardHeader title='Leave a Review' subheader='Take a few minutes to share your thoughts about the extension.' />

                <CardContent sx={{ paddingTop: '0px' }}>
                    <Rating size='large' value={4.5} onChange={handleAccept} precision={0.5} />

                    <Typography>Your feedback is valuable!</Typography>
                </CardContent>

                <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant='outlined' sx={{ textTransform: 'none' }} onClick={handleDismiss}>
                        Later
                    </Button>

                    <Button variant='contained' sx={{ textTransform: 'none' }} onClick={handleAccept}>
                        Review
                    </Button>
                </CardActions>
            </Card>
        </Backdrop>
    );
};
