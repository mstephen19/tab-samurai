import { POPUP_URL } from './consts';
import type { AppData, Config } from './types';

export const pluralize = (count: number, singular: string, plural: string) => {
    return Math.abs(count) === 1 ? singular : plural;
};

export const getUrl = (str: string) => {
    try {
        const url = new URL(str);
        return url;
    } catch {
        return null;
    }
};

export const getUrlDomain = (str: string) => {
    const url = getUrl(str.replace(/(?<=^https?:\/\/)www\./, ''));

    return url && url.origin;
};

export const logger = (name: string, color?: string) => {
    const prefix = `[${name}]`;
    const prefixArgs = color ? [`%c${prefix}`, `color: ${color};`] : [prefix];

    return {
        debug: (...args: Parameters<typeof console.debug>) => console.debug(...prefixArgs, ...args),
        error: (...args: Parameters<typeof console.error>) => console.error(...prefixArgs, ...args),
    };
};

export const tabGroupFns: Record<
    AppData['manageTabsGroupBy'],
    (tabs: chrome.tabs.Tab[]) => Record<`${string}\\${string}`, chrome.tabs.Tab[]>
> = {
    Domain: (tabs: chrome.tabs.Tab[]) =>
        tabs.reduce<Record<`${string}\\${string}`, chrome.tabs.Tab[]>>((acc, tab) => {
            const domain = tab.url ? getUrlDomain(tab.url) || 'Unknown' : 'Unknown';

            const compoundKey = `${domain}\\${domain}` as const;

            acc[compoundKey] ??= [];
            acc[compoundKey].push(tab);

            return acc;
        }, {}),
    Window: (tabs: chrome.tabs.Tab[]) => {
        const tabsByWindow = tabs.reduce<Record<number, chrome.tabs.Tab[]>>((acc, tab) => {
            acc[tab.windowId] ??= [];
            acc[tab.windowId].push(tab);

            return acc;
        }, {});

        return Object.entries(tabsByWindow).reduce<Record<string, chrome.tabs.Tab[]>>((acc, [windowId, tabs]) => {
            const pinnedTabCount = tabs.reduce((acc, tab) => acc + (tab.pinned ? 1 : 0), 0);

            const suspendedTabCount = tabs.reduce((acc, tab) => acc + (tab.discarded ? 1 : 0), 0);

            acc[`${pinnedTabCount} Pinned, ${suspendedTabCount} Hibernating\\${windowId}`] = tabs;

            return acc;
        }, {});
    },
};

export const tabs = {
    shouldWhitelist: (tab: chrome.tabs.Tab, latestConfig: Config) => {
        const tabUrlDomain = tab.url ? getUrlDomain(tab.url) : null;

        return (
            tab.url === POPUP_URL ||
            tab.audible ||
            (!latestConfig.discardPinnedTabs && tab.pinned) ||
            (tabUrlDomain && latestConfig.whitelistedDomains.some((domain) => tabUrlDomain.startsWith(domain)))
        );
    },
    getDuplicateTabs: (tabs: chrome.tabs.Tab[]) => {
        const duplicateTabs = Object.values(
            // Group tabs by URL (excluding #hash)
            tabs.reduce<Record<string, chrome.tabs.Tab[]>>((acc, tab) => {
                if (!tab.url) return acc;

                const url = new URL(tab.url);
                url.hash = '';
                const sanitizedUrl = url.toString();

                acc[sanitizedUrl] ??= [];
                acc[sanitizedUrl].push(tab);

                return acc;
            }, {})
            // Find URLs with duplicate tabs
        ).filter((tabList) => tabList.length > 1);

        // Grab all duplicates in a group, excluding one
        // Prioritize inactive, unpinned, inaudible, and discarded tabs
        // Keep the tab that is the "most" active, pinned, audible, and not discarded
        return duplicateTabs.flatMap((tabList) =>
            tabList
                .sort((a, b) => {
                    if (a.active !== b.active) return a.active ? -1 : 1;

                    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;

                    if (Boolean(a.audible && !a.mutedInfo?.muted) !== Boolean(b.audible && !b.mutedInfo?.muted)) {
                        return a.audible && !a.mutedInfo?.muted ? -1 : 1;
                    }

                    if (a.discarded !== b.discarded) return a.discarded ? 1 : -1;

                    return 0;
                })
                .slice(1)
        );
    },
    openUrl: (url: string | string[]) => async () => {
        if (!url && !url?.length) return;

        const createdTabs = await Promise.all(
            (Array.isArray(url) ? url : [url]).map((url, i, arr) => chrome.tabs.create({ url, active: i === arr.length - 1 }))
        );

        // Ensure the window the tabs were opened in is focused
        const { windowId } = createdTabs.pop()!;
        if (windowId) await chrome.windows.update(windowId, { focused: true });
    },
};
