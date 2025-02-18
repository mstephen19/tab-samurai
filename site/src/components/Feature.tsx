import { Box, Typography, type SvgIcon } from '@mui/material';
import Image from 'next/image';
import type { ReactNode } from 'react';

export const Feature = ({
    alignImage,
    title,
    icon: Icon,
    imageSrc,
    imageAlt,
    content,
}: {
    alignImage: 'right' | 'left';
    title: string;
    icon?: typeof SvgIcon;
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
                        loading='lazy'
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
                <Typography component='h2' fontSize='clamp(2rem, 2.75dvw, 2.75rem)' textAlign='center'>
                    {Icon && (
                        <Icon
                            sx={{
                                fontSize: 'inherit',
                                verticalAlign: 'middle',
                                display: 'inline-block',
                                marginRight: '5px',
                            }}
                        />
                    )}

                    {title}
                </Typography>

                {content}
            </Box>
        </Box>
    );
};
