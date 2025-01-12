import { Accordion, AccordionDetails, AccordionSummary, type AccordionSummaryProps, Chip, styled, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ReactNode, useCallback, useContext } from 'react';
import { AppData } from '../../types';
import { AppDataContext } from '../context/AppDataProvider';
import { store } from '../../storage';

const AccordionHeader = styled((props: AccordionSummaryProps) => <AccordionSummary expandIcon={<ExpandMoreIcon />} {...props} />)({
    '& .MuiAccordionSummary-content': {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
});

export const ManagedAccordion = ({
    icon,
    title,
    stateKey,
    children,
    unmountOnExit = false,
    chip,
}: {
    icon: ReactNode;
    title: string;
    stateKey: keyof AppData['accordionState'];
    children?: ReactNode;
    unmountOnExit?: boolean;
    chip?: string | number;
}) => {
    const appData = useContext(AppDataContext);

    const handleAccordionChange = useCallback(
        (_: unknown, expanded: boolean) => {
            store.appData.write({
                ...appData,
                accordionState: {
                    ...appData.accordionState,
                    [stateKey]: expanded,
                },
            });
        },
        [stateKey, appData]
    );

    return (
        <Accordion
            elevation={3}
            disableGutters
            slotProps={unmountOnExit ? { transition: { unmountOnExit: true } } : undefined}
            expanded={appData.accordionState[stateKey]}
            onChange={handleAccordionChange}>
            <AccordionHeader>
                {icon}

                <Typography>{title}</Typography>

                {Boolean(chip) && <Chip color='primary' label={chip} size='small' />}
            </AccordionHeader>

            <AccordionDetails>{children}</AccordionDetails>
        </Accordion>
    );
};
