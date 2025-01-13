import { Typography, styled, type SvgIconProps } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { memo, useCallback, useState } from 'react';
import { CREATOR_LINKS } from '../consts';
import { Link } from './components/Link';

const RAINBOW = ['red', 'orange', 'yellow', 'forestgreen', 'darkturquoise', 'indigo', 'purple'];

const LoveIcon = styled((props: SvgIconProps) => <FavoriteIcon {...props} color='error' />)(({ theme }) => ({
    ...theme.applyStyles('light', {
        color: theme.palette.text.primary,
    }),
}));

export const Footer = memo(() => {
    const [rainbowIndex, setRainbowIndex] = useState(-1);

    const handleHeartClick = useCallback(() => setRainbowIndex((prev) => (prev >= RAINBOW.length - 1 ? -1 : prev + 1)), []);

    return (
        <Typography
            sx={{
                paddingTop: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                width: '100%',
                fontSize: '0.8rem',
            }}>
            Made With{' '}
            <LoveIcon
                fontSize='inherit'
                sx={{ mx: 0.5, color: rainbowIndex === -1 ? undefined : RAINBOW[rainbowIndex], transition: 'color 250ms ease-in-out' }}
                onClick={handleHeartClick}
            />{' '}
            By
            <Link ml={0.5} url={CREATOR_LINKS}>
                Matt Stephens
            </Link>
        </Typography>
    );
});
