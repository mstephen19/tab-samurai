import { AccordionDetails, Box, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import WebAssetIcon from '@mui/icons-material/WebAsset';
import { memo, useCallback, useMemo } from 'react';
import { BasicList, BasicListItem, BasicListItemText } from '../../components/BasicList';
import { Favicon } from '../../components/DomainFavicon';
import { EllipsesTypography } from '../../components/EllipsesTypography';
import { BasicAccordion, BasicAccordionSummary } from '../../components/BasicAccordion';
import { toast } from '../../Toast';
import { useFormattedDateTime } from '../../hooks/useFormattedDateTime';

const TabListItem = memo(
    ({
        title,
        favIconUrl,
        url,
        sessionId,
        lastModified,
    }: Pick<chrome.tabs.Tab, 'title' | 'favIconUrl' | 'url' | 'sessionId'> & { lastModified?: number }) => {
        const handleRecover = useCallback(async () => {
            try {
                await chrome.sessions.restore(sessionId);
            } catch {
                toast({
                    type: 'error',
                    message: 'Failed to recover tab.',
                });
            }
        }, [sessionId]);

        const lastModifiedTime = useFormattedDateTime(lastModified ? lastModified * 1_000 : lastModified);

        return (
            <BasicListItem
                sx={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '0px',
                }}>
                {lastModifiedTime && (
                    <Typography fontSize='0.8rem' color='primary' marginTop='6px'>
                        Closed on {lastModifiedTime}
                    </Typography>
                )}

                <Box display='flex' gap='10px' alignItems='center' width='100%'>
                    <Favicon url={favIconUrl} />

                    <BasicListItemText primary={title} secondary={url} />

                    <Tooltip title='Recover Tab' placement='left' arrow>
                        <IconButton onClick={handleRecover}>
                            <RestoreIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </BasicListItem>
        );
    }
);

const WindowListItem = memo(({ window, lastModified }: { window: chrome.windows.Window; lastModified: number }) => {
    const handleRecover = useCallback(async () => {
        try {
            await chrome.sessions.restore(window.sessionId);
        } catch {
            toast({
                type: 'error',
                message: 'Failed to recover window.',
            });
        }
    }, [window.sessionId]);

    const lastModifiedTime = useFormattedDateTime(lastModified * 1_000);

    const favIconUrl = useMemo(() => window.tabs?.find((tab) => Boolean(tab.favIconUrl))?.favIconUrl, [window.tabs]);

    return (
        <BasicListItem>
            <BasicAccordion slotProps={{ transition: { unmountOnExit: true } }} disabled={!window.tabs?.length}>
                <Box>
                    {lastModifiedTime && (
                        <Typography fontSize='0.8rem' color='primary' marginTop='6px'>
                            Closed on {lastModifiedTime}
                        </Typography>
                    )}

                    <Box display='flex' alignItems='center' gap='5px'>
                        <BasicAccordionSummary>
                            {favIconUrl ? <Favicon url={favIconUrl} /> : <WebAssetIcon style={{ fontSize: '1.5rem' }} />}

                            <EllipsesTypography>Window</EllipsesTypography>

                            {Boolean(window.tabs?.length) && <Chip color='primary' label={window.tabs!.length.toString()} size='small' />}
                        </BasicAccordionSummary>

                        <Tooltip title='Recover Window' placement='left' arrow>
                            <IconButton onClick={handleRecover}>
                                <RestoreIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                <AccordionDetails>
                    <BasicList>
                        {window.tabs?.map((tab) => (
                            <TabListItem
                                key={`recover-tab-${tab.id}`}
                                title={tab.title}
                                favIconUrl={tab.favIconUrl}
                                url={tab.url}
                                sessionId={tab.sessionId}
                            />
                        ))}
                    </BasicList>
                </AccordionDetails>
            </BasicAccordion>
        </BasicListItem>
    );
});

export const TabRecoveryListItem = ({ session }: { session: chrome.sessions.Session }) => {
    return session.tab ? (
        <TabListItem
            title={session.tab.title}
            favIconUrl={session.tab.favIconUrl}
            url={session.tab.url}
            sessionId={session.tab.sessionId}
            lastModified={session.lastModified}
        />
    ) : session.window?.tabs?.length === 1 ? (
        <TabListItem
            title={session.window!.tabs[0].title}
            favIconUrl={session.window!.tabs[0].favIconUrl}
            url={session.window!.tabs[0].url}
            sessionId={session.window!.tabs[0].sessionId}
            lastModified={session.lastModified}
        />
    ) : (
        <WindowListItem window={session.window!} lastModified={session.lastModified} />
    );
};
