import { Box, List, ListItem, ListItemText } from '@mui/material';
import { HELP_AND_INFO_FAQ } from '../../../consts';

export const Info = () => {
    return (
        <Box display='flex' flexDirection='column'>
            <List disablePadding>
                {HELP_AND_INFO_FAQ.map(({ primary, secondary }) => (
                    <ListItem key={`info-item-${primary}`} disablePadding>
                        <ListItemText primary={primary} secondary={secondary} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};
