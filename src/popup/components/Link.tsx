import { Link as MUILink, type LinkProps } from '@mui/material';
import { useCallback } from 'react';

export const Link = ({ url, ...props }: LinkProps & { url: string | string[] }) => {
    const handleUrlClick = useCallback(() => {
        (Array.isArray(url) ? url : [url]).forEach((url, i, arr) => chrome.tabs.create({ url, active: i === arr.length - 1 }));
    }, [url]);

    return <MUILink color='inherit' fontSize='inherit' sx={{ cursor: 'pointer' }} component='span' onClick={handleUrlClick} {...props} />;
};
