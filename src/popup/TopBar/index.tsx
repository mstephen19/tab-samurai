import { AppBar, Box, styled, Toolbar, Tooltip, Typography } from '@mui/material';
import logo from '../../assets/logo.png';
import { ThemeSwitch } from './ThemeSwitch';
import { store } from '../../storage';
import { memo, useCallback, useContext, useRef } from 'react';
import { AppDataContext } from '../context/AppDataProvider';
import { EXTENSION_VERSION } from '../../consts';

const Logo = memo(() => {
    const clickCount = useRef(0);
    const clickCountResetTimeout = useRef<ReturnType<typeof setTimeout>>();

    const clearClickCount = useCallback(() => (clickCount.current = 0), []);

    const handleLogoClick = useCallback(() => {
        clickCount.current++;
        if (clickCount.current === 1) {
            clickCountResetTimeout.current = setTimeout(clearClickCount, 1_000);
        }

        if (clickCount.current === 5) {
            chrome.tabs.create({ url: 'https://www.youtube.com/watch?v=AtPrjYp75uA' });
            clearTimeout(clickCountResetTimeout.current);
            clearClickCount();
        }
    }, [clearClickCount]);

    return <img onClick={handleLogoClick} src={logo} alt='Tab Samurai logo' style={{ width: '40px' }} />;
});

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
            </FlexToolbar>
        </AppBar>
    );
};
