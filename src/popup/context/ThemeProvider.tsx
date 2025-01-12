import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ReactNode, useContext } from 'react';
import { AppDataContext } from './AppDataProvider';

const fontFamily = ['Cabin', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(',');

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#C64635',
        },
    },
    typography: {
        fontFamily,
    },
});

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#C64635',
        },
    },
    typography: {
        fontFamily,
    },
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const theme = useContext(AppDataContext).theme;

    return (
        <MUIThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
            <CssBaseline />
            {children}
        </MUIThemeProvider>
    );
};
