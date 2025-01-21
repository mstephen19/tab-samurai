'use client';
import Image from 'next/image';
import { AppBar, Toolbar, Box } from '@mui/material';
import { ThemeToggle } from './ThemeToggle';
import { useEffect, useState } from 'react';

export const TopBar = () => {
    const [hide, setHide] = useState(false);

    useEffect(() => {
        const threshold = 250;

        let prevScrollY = 0;
        const scrollListener = () => {
            const shouldHide = window.scrollY > prevScrollY && window.scrollY >= threshold;
            setHide(shouldHide);

            prevScrollY = window.scrollY;
        };

        scrollListener();
        window.addEventListener('scroll', scrollListener);

        return () => {
            window.removeEventListener('scroll', scrollListener);
        };
    }, []);

    return (
        <AppBar
            component='nav'
            position='fixed'
            sx={{
                transform: hide ? `translateY(-100%)` : undefined,
                transition: 'transform 250ms ease-in-out',
            }}>
            <Toolbar
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    userSelect: 'none',
                }}>
                <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}>
                    <Image src='./logo.png' alt='Tab Samurai logo' loading='eager' width={40} height={40} unoptimized />
                </Box>

                <ThemeToggle />
            </Toolbar>
        </AppBar>
    );
};
