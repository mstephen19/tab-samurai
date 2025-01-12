import { createContext, useEffect, useState, type ReactNode } from 'react';

export const SessionsContext = createContext<chrome.sessions.Session[]>([]);

export const SessionsProvider = ({ children }: { children?: ReactNode }) => {
    const [sessions, setSessions] = useState<chrome.sessions.Session[]>([]);

    useEffect(() => {
        const hydrate = async () => setSessions(await chrome.sessions.getRecentlyClosed());

        chrome.sessions.onChanged.addListener(hydrate);
        hydrate();

        return () => {
            chrome.sessions.onChanged.removeListener(hydrate);
        };
    }, []);

    return <SessionsContext.Provider value={sessions}>{children}</SessionsContext.Provider>;
};
