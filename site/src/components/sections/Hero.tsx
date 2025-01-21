import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import NextLink from 'next/link';

export const Hero = () => {
    return (
        <Box
            component='section'
            sx={{
                height: 'clamp(650px, 75dvh, 1000px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '15px',
                scrollSnapAlign: 'start',
            }}>
            <Image
                unoptimized
                src='./logo.png'
                alt='Tab Samurai logo'
                loading='eager'
                style={{
                    width: 'clamp(100px, 50dvw, 275px)',
                    height: 'auto',
                }}
                width={0}
                height={0}
            />

            <Typography component='h1' fontSize='4rem' lineHeight='4rem' fontWeight='bold' textAlign='center'>
                Tab Samurai
            </Typography>

            <Typography fontSize='1.25rem' textAlign='center' sx={{ textUnderlineOffset: '3px' }}>
                The <u>only</u> tab extension you <u>need</u>.
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    gap: '10px',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                }}>
                <Button
                    color='info'
                    title='Install For Chrome, Edge, and Brave'
                    target='_blank'
                    variant='contained'
                    component={NextLink}
                    href='https://chromewebstore.google.com/detail/tab-samurai/mbomhgfddnnehpokebhcgjgmmagkgemc'
                    sx={{ display: 'flex', gap: '10px' }}>
                    <Image src='./chrome_webstore.jpg' loading='eager' alt='Chrome WebStore logo' width={20} height={20} unoptimized />
                    Install For Chrome, Edge, and Brave
                </Button>

                <Button
                    title='See on Github'
                    target='_blank'
                    variant='contained'
                    component={NextLink}
                    href='https://github.com/mstephen19/tab-samurai'
                    sx={{ display: 'flex', gap: '10px' }}>
                    <Image src='./github.svg' loading='eager' alt='Chrome WebStore logo' width={20} height={20} unoptimized />
                    See on Github
                </Button>
            </Box>
        </Box>
    );
};
