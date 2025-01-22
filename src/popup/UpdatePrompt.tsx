import { Backdrop, Card, CardHeader, CardActions, Button } from '@mui/material';
import { useCallback, useContext, useState } from 'react';
import { UpdateContext } from './context/UpdateProvider';

export const UpdatePrompt = () => {
    const version = useContext(UpdateContext);
    const available = Boolean(version);
    const [dismissed, setDismissed] = useState(false);

    const handleUpdate = useCallback(() => chrome.runtime.reload(), []);

    const handleDismiss = useCallback(() => setDismissed(true), []);

    return (
        <Backdrop sx={{ zIndex: 2147483647 }} open={available && !dismissed}>
            <Card sx={{ padding: '10px' }}>
                <CardHeader title='Update Available!' subheader={`New version: v${version}`} />

                <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant='outlined' sx={{ textTransform: 'none' }} onClick={handleDismiss}>
                        Later
                    </Button>

                    <Button variant='contained' sx={{ textTransform: 'none' }} onClick={handleUpdate}>
                        Update Now
                    </Button>
                </CardActions>
            </Card>
        </Backdrop>
    );
};
