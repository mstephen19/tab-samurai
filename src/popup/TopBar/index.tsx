import { AppBar, Box, styled, Toolbar, Tooltip, Typography } from '@mui/material';
import { ThemeSwitch } from './ThemeSwitch';
import { store } from '../../storage';
import { useContext } from 'react';
import { AppDataContext } from '../context/AppDataProvider';
import { EXTENSION_VERSION } from '../../consts';
import { Logo } from './Logo';
import { PopOutButton } from './PopOutButton';
import { OPENED_IN_POPOUT } from '../consts';
const FlexToolbar = styled(Toolbar)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    userSelect: 'none',
});

const LogoBox = styled(Box)({ display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' });

export const TopBar = ({ onLogoClick }: { onLogoClick: () => void }) => {
    const appData = useContext(AppDataContext);

    return (
        <AppBar position='static' elevation={0}>
            <FlexToolbar>
                <Box display='flex' flex={1}>
                    <Tooltip title='Click to scroll back to the top' arrow placement='right'>
                        <LogoBox onClick={onLogoClick}>
                            <Logo />

                            <Box display='flex' gap='5px'>
                                <Typography variant='h1' fontSize='1.5rem' fontWeight='bold'>
                                    Tab Samurai
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        alignSelf: 'flex-end',
                                    }}>
                                    v{EXTENSION_VERSION}
                                </Typography>
                            </Box>
                        </LogoBox>
                    </Tooltip>
                </Box>

                <Tooltip title={`Switch to ${appData.theme === 'light' ? 'dark' : 'light'} theme`} arrow placement='bottom'>
                    <ThemeSwitch
                        checked={appData.theme === 'dark'}
                        onChange={(_, checked) =>
                            store.appData.write({
                                ...appData,
                                theme: checked ? 'dark' : 'light',
                            })
                        }
                    />
                </Tooltip>

                {!OPENED_IN_POPOUT && <PopOutButton />}
            </FlexToolbar>
        </AppBar>
    );
};
