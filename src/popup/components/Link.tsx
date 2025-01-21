import { Link as MUILink, type LinkProps } from '@mui/material';
import { useMemo } from 'react';
import { tabs } from '../../utils';

export const Link = ({ url, ...props }: LinkProps & { url: string | string[] }) => {
    const handleUrlClick = useMemo(() => tabs.openUrl(url), [url]);

    return <MUILink color='inherit' fontSize='inherit' sx={{ cursor: 'pointer' }} component='span' onClick={handleUrlClick} {...props} />;
};
