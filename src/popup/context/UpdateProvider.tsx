import { createContext, type ReactNode, useEffect, useState } from 'react';
import { EXTENSION_VERSION } from '../../consts';

export const UpdateContext = createContext({
    available: false,
    version: EXTENSION_VERSION,
});

export const UpdateProvider = ({ children }: { children?: ReactNode }) => {
    const [info, setInfo] = useState({
        available: false,
        version: EXTENSION_VERSION,
    });

    useEffect(() => {
        const listener = ({ version }: chrome.runtime.UpdateAvailableDetails) => setInfo({ available: true, version: version });

        const init = async () => {
            const details = await chrome.runtime.requestUpdateCheck();

            if (details.status === 'update_available') {
                chrome.runtime.onUpdateAvailable.removeListener(listener);

                setInfo({ available: true, version: details.version });
            }
        };

        init();

        chrome.runtime.onUpdateAvailable.addListener(listener);

        return () => {
            chrome.runtime.onUpdateAvailable.removeListener(listener);
        };
    }, []);

    return <UpdateContext.Provider value={info}>{children}</UpdateContext.Provider>;
};
