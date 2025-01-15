'use client';
import { createTheme } from '@mui/material/styles';

const fontFamily = 'var(--font-cabin)';

const theme = createTheme({
    colorSchemes: {
        light: {
            palette: {
                mode: 'light',
                primary: {
                    main: '#C64635',
                },
            },
        },
        dark: {
            palette: {
                mode: 'dark',
                primary: {
                    main: '#C64635',
                },
            },
        },
    },
    cssVariables: {
        colorSchemeSelector: 'class',
    },
    defaultColorScheme: 'light',
    typography: {
        fontFamily,
    },
});

export default theme;
