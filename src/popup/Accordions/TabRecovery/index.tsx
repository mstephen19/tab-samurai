import { Box, Divider } from '@mui/material';
import { Fragment, useContext } from 'react';
import { BasicList } from '../../components/BasicList';
import { SessionsContext } from '../../context/SessionsProvider';
import { TabRecoveryListItem } from './TabRecoveryListItem';

export const TabRecovery = () => {
    const sessions = useContext(SessionsContext);

    return (
        <Box display='flex' flexDirection='column'>
            <BasicList>
                {sessions.map((session, i) => (
                    <Fragment key={`session-${session.tab?.sessionId || session.window?.sessionId}`}>
                        {i !== 0 && <Divider />}

                        <TabRecoveryListItem session={session} />
                    </Fragment>
                ))}
            </BasicList>
        </Box>
    );
};
