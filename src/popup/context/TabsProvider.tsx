import { createContext, ReactNode, useEffect, useState } from 'react';

export const TabsContext = createContext<chrome.tabs.Tab[]>([]);

export const TabsProvider = ({ children }: { children?: ReactNode }) => {
    const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);

    useEffect(() => {
        const hydrate = async () => {
            const tabs = await chrome.tabs.query({});
            setTabs(tabs);
        };

        chrome.tabs.onCreated.addListener(hydrate);
        chrome.tabs.onRemoved.addListener(hydrate);
        chrome.tabs.onUpdated.addListener(hydrate);
        chrome.tabs.onReplaced.addListener(hydrate);

        hydrate();

        return () => {
            chrome.tabs.onCreated.removeListener(hydrate);
            chrome.tabs.onRemoved.removeListener(hydrate);
            chrome.tabs.onUpdated.removeListener(hydrate);
            chrome.tabs.onReplaced.removeListener(hydrate);
        };
    }, []);

    return <TabsContext.Provider value={tabs}>{children}</TabsContext.Provider>;
};
