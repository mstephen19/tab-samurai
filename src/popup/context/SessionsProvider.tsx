import { createContext, useEffect, useState, type ReactNode } from 'react';
import { POPUP_URL } from '../../consts';

export const SessionsContext = createContext<chrome.sessions.Session[]>([]);

export const SessionsProvider = ({ children }: { children?: ReactNode }) => {
    const [sessions, setSessions] = useState<chrome.sessions.Session[]>([]);

    useEffect(() => {
        const hydrate = async () => {
            const recentlyClosed = await chrome.sessions.getRecentlyClosed();

            setSessions(
                // Filter out sessions that were for a popout
                recentlyClosed.reduce<chrome.sessions.Session[]>((acc, session) => {
                    if (session.tab) {
                        if (session.tab?.url !== POPUP_URL) acc.push(session);

                        return acc;
                    }

                    if (session.window) {
                        const filteredTabs = session.window.tabs?.filter((tab) => tab.url !== POPUP_URL);

                        if (filteredTabs?.length) {
                            acc.push({
                                ...session,
                                window: {
                                    ...session.window,
                                    tabs: filteredTabs,
                                },
                            });
                        }
                    }

                    return acc;
                }, [])
            );
        };

        chrome.sessions.onChanged.addListener(hydrate);
        hydrate();

        return () => {
            chrome.sessions.onChanged.removeListener(hydrate);
        };
    }, []);

    return <SessionsContext.Provider value={sessions}>{children}</SessionsContext.Provider>;
};
