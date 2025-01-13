import { Box, Divider, List, ListItem, ListItemText } from '@mui/material';
import { FEATURE_REQUEST_URL, HELP_AND_INFO_FAQ, REPORT_BUG_URL } from '../../../consts';
import { Link } from '../../components/Link';

export const Info = () => {
    return (
        <Box display='flex' flexDirection='column' gap='10px'>
            <List disablePadding>
                {HELP_AND_INFO_FAQ.map(({ primary, secondary }) => (
                    <ListItem key={`info-item-${primary}`} disablePadding>
                        <ListItemText primary={primary} secondary={secondary} />
                    </ListItem>
                ))}
            </List>

            <Divider flexItem />

            <Box display='flex' gap='10px'>
                <Link url={FEATURE_REQUEST_URL}>Request a Feature</Link>

                <Link url={REPORT_BUG_URL}>Report a Bug</Link>
            </Box>
        </Box>
    );
};
