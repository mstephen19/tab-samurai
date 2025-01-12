import { Accordion, type AccordionSummaryProps, styled, type AccordionProps, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { forwardRef } from 'react';

export const BasicAccordion = styled((props: AccordionProps) => <Accordion {...props} elevation={3} disableGutters />)({
    boxShadow: 'none',
    width: '100%',
    '& .MuiAccordionSummary-root': {
        padding: '0px',
    },
    '& .MuiAccordionSummary-content': {
        display: 'flex',
        gap: '10px',
        overflow: 'hidden',
    },
});

export const BasicAccordionSummary = styled(
    forwardRef<HTMLDivElement>((props: AccordionSummaryProps, ref) => (
        <AccordionSummary {...props} expandIcon={<ExpandMoreIcon sx={{ fontSize: '13px' }} />} ref={ref} />
    ))
)({
    flexDirection: 'row-reverse',
    gap: '3px',
    '& .MuiAccordionSummary-content': {
        display: 'flex',
        alignItems: 'center',
    },
}) as typeof AccordionSummary;
