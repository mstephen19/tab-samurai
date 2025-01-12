import { Box, Chip, Tooltip, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

export const ConfigName = ({
    name,
    tip,
    value,
    unit,
    disableColon = false,
    chip,
}: {
    name: string;
    tip: string;
    value?: number | string;
    unit?: string;
    disableColon?: boolean;
    chip?: string;
}) => (
    <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Tooltip title={tip} arrow placement='top'>
            <InfoIcon sx={{ fontSize: '1rem', cursor: 'pointer' }} />
        </Tooltip>

        <Typography>{`${name}${disableColon ? '' : ':'}${value !== undefined && value !== null ? ` ${value}` : ''}${
            unit !== undefined && unit !== null ? ` ${unit}` : ''
        }`}</Typography>

        {Boolean(chip) && <Chip color='primary' label={chip} size='small' />}
    </Box>
);
