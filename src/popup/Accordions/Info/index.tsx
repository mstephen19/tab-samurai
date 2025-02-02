import { Box, Divider, List, ListItem, ListItemText } from '@mui/material';
import { FEATURE_REQUEST_URL, HELP_AND_INFO_FAQ, REPORT_BUG_URL, REVIEW_EXTENSION_URL } from '../../../consts';
import { Link } from '../../components/Link';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import BugReportIcon from '@mui/icons-material/BugReport';
import StarIcon from '@mui/icons-material/Star';

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

            <Box display='flex' justifyContent='space-between'>
                <Box component='span' display='flex' alignItems='center' gap='5px'>
                    <TipsAndUpdatesIcon sx={{ fontSize: '1rem' }} />

                    <Link url={FEATURE_REQUEST_URL}>Request a Feature</Link>
                </Box>

                <Box component='span' display='flex' alignItems='center' gap='5px'>
                    <BugReportIcon sx={{ fontSize: '1rem' }} />

                    <Link url={REPORT_BUG_URL}>Report a Bug</Link>
                </Box>

                <Box component='span' display='flex' alignItems='center' gap='5px'>
                    <StarIcon sx={{ fontSize: '1rem' }} />

                    <Link url={REVIEW_EXTENSION_URL}>Leave a Review</Link>
                </Box>
            </Box>
        </Box>
    );
};
