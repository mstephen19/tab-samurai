import { Box, Divider, List, ListItem } from '@mui/material';
import { Feature } from '@/components/Feature';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import TuneIcon from '@mui/icons-material/Tune';
import RestoreIcon from '@mui/icons-material/Restore';

// 100% static
export const revalidate = false;

export const Features = () => {
    return (
        <Box
            component='section'
            sx={{
                padding: '20px 0px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
            }}>
            <Feature
                alignImage='right'
                title='Automatic tab hibernation, managed by you.'
                icon={BedtimeIcon}
                imageSrc='./screenshots/automatic-tab-hibernation.png'
                imageAlt='Settings panel within Tab Samurai. Displays the "Hibernate Tabs After" option, "Hibernate Pinned Tabs" option, and "Domain Whitelist".'
                content={
                    <List sx={{ listStyleType: 'disc', listStyle: 'inside', fontSize: '1.1rem' }}>
                        <ListItem
                            sx={{
                                display: 'list-item',
                            }}>{`Boost browser performance by suspending tabs you haven't used in a while.`}</ListItem>
                        <ListItem
                            sx={{
                                display: 'list-item',
                            }}>{`Choose how long a tab should go un-viewed before hibernating.`}</ListItem>
                        <ListItem
                            sx={{
                                display: 'list-item',
                            }}>{`Manage which tabs should hibernate by curating a domain whitelist.`}</ListItem>
                    </List>
                }
            />

            <Divider />

            <Feature
                alignImage='left'
                title='Maximum visibility of every tab across all windows.'
                icon={TravelExploreIcon}
                imageSrc='./screenshots/maximum-visibility.png'
                imageAlt={
                    'Searching for "sunglasses" within Tab Samurai\'s Tab Manager. Results include tabs for eBay, Amazon, and AliExpress.'
                }
                content={
                    <List sx={{ listStyleType: 'disc', listStyle: 'inside', fontSize: '1.1rem' }}>
                        <ListItem
                            sx={{
                                display: 'list-item',
                            }}>{`Search through all tabs with a single query.`}</ListItem>
                        <ListItem
                            sx={{
                                display: 'list-item',
                            }}>{`View your tabs grouped by window, or by domain.`}</ListItem>
                        <ListItem
                            sx={{
                                display: 'list-item',
                            }}>{`Quickly find tabs which are recording using your webcam/microphone, playing audio/video, or both.`}</ListItem>
                    </List>
                }
            />

            <Divider />

            <Feature
                alignImage='right'
                title='Fine-grained control of tabs, made simple.'
                icon={TuneIcon}
                imageSrc='./screenshots/fine-grained-control.png'
                imageAlt='Viewing management options for a tab within Tab Samurai, offering "Close", "Mute", "Hibernate", and "Pin".'
                content={
                    <List sx={{ listStyleType: 'disc', listStyle: 'inside', fontSize: '1.1rem' }}>
                        <ListItem
                            sx={{
                                display: 'list-item',
                            }}>{`Close an individual tab, or mass-close tabs under a certain domain.`}</ListItem>
                        <ListItem
                            sx={{
                                display: 'list-item',
                            }}>{`Mute an individual tab, or mass-mute all tabs in a window.`}</ListItem>
                        <ListItem
                            sx={{
                                display: 'list-item',
                            }}>{`Move all tabs under a certain domain to a new window.`}</ListItem>
                    </List>
                }
            />

            <Divider />

            <Feature
                alignImage='left'
                title='Intuitive lost tab recovery.'
                icon={RestoreIcon}
                imageSrc='./screenshots/smart-tab-recovery.png'
                imageAlt='Demonstration of recovering a tab using the "Tab Recovery" list within Tab Samurai.'
                content={
                    <List sx={{ listStyleType: 'disc', listStyle: 'inside', fontSize: '1.1rem' }}>
                        <ListItem
                            sx={{
                                display: 'list-item',
                            }}>{`View recently closed tab & windows in a list.`}</ListItem>
                        <ListItem
                            sx={{
                                display: 'list-item',
                            }}>{`See the date & time for when a tab or window was closed.`}</ListItem>
                        <ListItem
                            sx={{
                                display: 'list-item',
                            }}>{`Recover a closed tab or window, or a specific tab in a closed window.`}</ListItem>
                    </List>
                }
            />
        </Box>
    );
};
