import logo from '../../assets/logo.png';
import { memo, useCallback, useRef } from 'react';
import { tabs } from '../../utils';

const openLogoUrl = tabs.openUrl('https://www.youtube.com/watch?v=AtPrjYp75uA');

export const Logo = memo(() => {
    const clickCount = useRef(0);
    const clickCountResetTimeout = useRef<ReturnType<typeof setTimeout>>();

    const clearClickCount = useCallback(() => (clickCount.current = 0), []);

    const handleLogoClick = useCallback(() => {
        clickCount.current++;
        if (clickCount.current === 1) {
            clickCountResetTimeout.current = setTimeout(clearClickCount, 1_000);
        }

        if (clickCount.current === 5) {
            openLogoUrl();
            clearTimeout(clickCountResetTimeout.current);
            clearClickCount();
        }
    }, [clearClickCount]);

    return <img onClick={handleLogoClick} src={logo} alt='Tab Samurai logo' style={{ width: '40px' }} />;
});
