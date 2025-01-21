import { Link as MUILink, type LinkProps } from '@mui/material';
import { useCallback } from 'react';

export const Link = ({ url, ...props }: LinkProps & { url: string | string[] }) => {
    const handleUrlClick = useCallback(async () => {
        const createdTabs = await Promise.all(
            (Array.isArray(url) ? url : [url]).map((url, i, arr) => chrome.tabs.create({ url, active: i === arr.length - 1 }))
        );

        // Ensure the window the tabs were opened in is focused
        const { windowId } = createdTabs.pop()!;
        if (windowId) chrome.windows.update(windowId, { focused: true });
    }, [url]);

    return <MUILink color='inherit' fontSize='inherit' sx={{ cursor: 'pointer' }} component='span' onClick={handleUrlClick} {...props} />;
};
