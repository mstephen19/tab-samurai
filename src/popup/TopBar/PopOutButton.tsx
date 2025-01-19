import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { IconButton, Tooltip } from '@mui/material';
import { POPUP_URL } from '../../consts';
import { memo, useCallback } from 'react';

const openPopOut = () => {
    const popOutWindow = window.open(
        POPUP_URL,
        '_blank',
        `width=600,
height=600,
popup=true,
menubar=false,
resizable=0`
    );

    popOutWindow?.addEventListener('DOMContentLoaded', () => window.close());
};

export const PopOutButton = memo(() => {
    const handleOpenPopout = useCallback(async () => {
        const [existingPopOutTab] = await chrome.tabs.query({ url: POPUP_URL });

        if (existingPopOutTab) {
            await Promise.all([
                chrome.tabs.update(existingPopOutTab.id!, { active: true }),
                chrome.windows.update(existingPopOutTab.windowId, { focused: true }),
            ]);

            window.close();

            return;
        }

        openPopOut();
    }, []);

    return (
        <Tooltip title='Pop out' arrow placement='bottom'>
            <IconButton onClick={handleOpenPopout} size='small'>
                <OpenInNewIcon />
            </IconButton>
        </Tooltip>
    );
});
