'use client';

import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';

const ADSTERRA_KEY = '61e7de11c9e4d483dc42bd7873a35014';

export const Adsterra = () => {
    const adsContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!adsContainer.current) return;

        const script = Object.assign(document.createElement('script'), {
            async: true,
            src: `//pl25629427.profitablecpmrate.com/${ADSTERRA_KEY}/invoke.js`,
            type: 'text/javascript',
        });

        script.setAttribute('data-cfasync', 'false');

        adsContainer.current.appendChild(script);

        return () => script.remove();
    }, []);

    return (
        <Box ref={adsContainer}>
            <div id={`container-${ADSTERRA_KEY}`}></div>
        </Box>
    );
};
