import { Accordion, AccordionDetails, AccordionSummary, List, ListItem, ListItemText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ConfigName } from '../../../components/ConfigName';
import { AddDomainBox } from './AddDomainBox';
import { useContext, lazy, Suspense } from 'react';
import { ConfigContext } from '../../../context/ConfigProvider';

const DomainListItem = lazy(() => import('./DomainListItem'));

export const DomainWhitelist = () => {
    const config = useContext(ConfigContext);

    return (
        <Accordion elevation={3} disableGutters slotProps={{ transition: { unmountOnExit: true } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <ConfigName
                    name='Whitelisted Domains'
                    disableColon
                    tip='Tabs under any domains listed below will never hibernate.'
                    chip={config.whitelistedDomains.length.toString()}
                />
            </AccordionSummary>

            <AccordionDetails>
                <AddDomainBox />

                <List>
                    <Suspense fallback={null}>
                        {config.whitelistedDomains.map((domain) => (
                            <DomainListItem key={`domain-item-${domain}`} domain={domain} />
                        ))}

                        {!config.whitelistedDomains.length && (
                            <ListItem disableGutters>
                                <ListItemText primary='Whitelist is empty.' />
                            </ListItem>
                        )}
                    </Suspense>
                </List>
            </AccordionDetails>
        </Accordion>
    );
};
