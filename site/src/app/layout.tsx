import { TopBar } from '../components/TopBar';
import { Cabin } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';
import './global.css';

import type { Metadata } from 'next';

const cabinFont = Cabin({
    variable: '--font-cabin',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Tab Samurai',
    applicationName: 'Tab Samurai',
    keywords: [
        'webstore',
        'tab manager',
        'tab extension',
        'tab suspender',
        'tab suspension',
        'chrome',
        'edge',
        'brave',
        'tabs',
        'browser',
        'recover lost tab',
        'lost tab',
        'manage tabs',
        'search tabs',
        'search all tabs',
    ],
    description:
        'Take your browsing experience to the next level with automatic tab hibernation, smart tab management, and intuitive tab recovery.',
    referrer: 'no-referrer-when-downgrade',
    robots: {
        index: true,
        follow: true,
        noimageindex: true,
    },
    openGraph: {
        type: 'website',
        url: 'https://mstephen19.github.io/tab-samurai',
        siteName: 'Tab Samurai',
        title: 'Tab Samurai',
        description:
            'Take your browsing experience to the next level with automatic tab hibernation, smart tab management, and intuitive tab recovery.',
    },
    other: {
        'google-site-verification': 'Bd4LAkjfHg1A--AkO0gk0s6_-pa5vmpnM2m4CoXkJIM',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' suppressHydrationWarning>
            <body className={cabinFont.className}>
                <InitColorSchemeScript attribute='class' />
                <AppRouterCacheProvider>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />

                        <TopBar />

                        {children}
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
