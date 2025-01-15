import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import type { ReactNode } from 'react';

export const Feature = ({
    alignImage,
    title,
    imageSrc,
    imageAlt,
    content,
}: {
    alignImage: 'right' | 'left';
    title: string;
    imageSrc: string;
    imageAlt: string;
    content: ReactNode;
}) => {
    return (
        <Box
            component='article'
            display='flex'
            flexWrap='wrap-reverse'
            gap='20px'
            flexDirection={alignImage === 'left' ? 'row' : 'row-reverse'}
            justifyContent='center'>
            <Box flex='1 1' minWidth='400px' maxWidth='700px' display='flex' justifyContent='center' alignItems='center'>
                <Box overflow='hidden' borderRadius='20px' height='fit-content' width='85%'>
                    <Image
                        src={imageSrc}
                        alt={imageAlt}
                        unoptimized
                        width={0}
                        height={0}
                        style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                        }}
                    />
                </Box>
            </Box>

            <Box flex='1 1' minWidth='400px' display='flex' flexDirection='column' justifyContent='center'>
                <Typography component='h2' fontSize='2.75rem' textAlign='center'>
                    {title}
                </Typography>

                {content}
            </Box>
        </Box>
    );
};
