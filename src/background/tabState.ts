import { collections } from '../storage';
import { logger } from '../utils';

const log = logger('State', 'magenta');

/**
 * Keeps track of when tabs were last "deactivated", and which tabs are active.
 *
 * A tab "deactivation" can be defined as when a tab becomes no longer active (or isn't active to begin with).
 */
export const initialize = async () => {
    const [timestamps, tabData, tabs, windows] = await Promise.all([
        collections.tabDeactivationTimestamps.read(),
        collections.windowActiveTabs.read(),
        chrome.tabs.query({}),
        chrome.windows.getAll(),
    ]);

    const accountedForTabs = Object.keys(timestamps);
    const accountedForWindows = Object.keys(tabData);

    // Remove data for no longer existing entities
    const initialWindowIds = windows.map(({ id }) => id!);
    const initialTabIds = tabs.map(({ id }) => id!);

    await Promise.all([
        // Remove all data for windows that no longer exist
        collections.windowActiveTabs.remove(accountedForWindows.filter((key) => !initialWindowIds.includes(+key))),
        // Remove all data for tabs that no longer exist
        collections.tabDeactivationTimestamps.remove(accountedForTabs.filter((key) => !initialTabIds.includes(+key))),
        // Add data about not yet accounted for active tabs
        collections.windowActiveTabs.set(
            tabs.reduce<Record<string, number>>((acc, { id, active, windowId }) => {
                if (!id || !active || accountedForWindows.includes(id.toString())) return acc;

                acc[windowId] = id!;
                return acc;
            }, {})
        ),
        // Add timestamps for tabs not yet accounted for
        collections.tabDeactivationTimestamps.set(
            tabs.reduce<Record<string, number>>((acc, { id, active }) => {
                if (!id || accountedForTabs.includes(id.toString())) return acc;

                acc[id] = active ? -1 : Date.now();

                return acc;
            }, {})
        ),
    ]);

    log.debug('Initialized');

    chrome.tabs.onCreated.addListener((tab) => {
        // If tab is active, onActivated will be called
        if (tab.active) return;

        // Otherwise, initializes deactivated and discard timer starts now
        collections.tabDeactivationTimestamps.set({ [tab.id!]: Date.now() });
        log.debug(`Deactivation - Tab: ${tab.id}, Window: ${tab.windowId}`);
    });

    // When a tab is activated, it fires of a single event, with the newly active tab
    // The problem is that there is no reference to the tab that was active before it
    //
    // This event will also fire off if an active tab moves to a new window.
    // If that's the case, a second event will fire, for the new active tab in the old window.
    chrome.tabs.onActivated.addListener(async (activeInfo) => {
        const [prevTimestamps, prevTabData] = await Promise.all([
            collections.tabDeactivationTimestamps.read(),
            collections.windowActiveTabs.read(),
        ]);
        const prevActiveTabs = Object.entries(prevTabData);

        // This tab is now active, instead of whatever was there before
        collections.windowActiveTabs.set({ [activeInfo.windowId]: activeInfo.tabId });
        collections.tabDeactivationTimestamps.set({ [activeInfo.tabId]: -1 });
        log.debug(`Activation - Tab: ${activeInfo.tabId}, Window: ${activeInfo.windowId}`);

        // If the tab was previously active, but moved windows, onActivated will fire again
        // for the replacement active tab

        // Finds the ID of the tab that was previously active in this window
        // Will be defined if there was a tab previously active in the window
        const [, prevTabId] = prevActiveTabs.find(([key]) => +key === activeInfo.windowId) ?? [];

        // If there was a previously active tab (which wasn't removed), it's now considered deactivated
        // since it was replaced with the newly activated tab.
        if (prevTabId && +prevTabId !== activeInfo.tabId && Boolean(prevTimestamps[prevTabId])) {
            // If the previous active tab moved windows
            const prevTab = await chrome.tabs.get(+prevTabId);
            if (prevTab.windowId !== activeInfo.windowId) return;

            collections.tabDeactivationTimestamps.set({ [prevTabId]: Date.now() });
            log.debug(`Deactivation - Tab: ${prevTabId}, Window: ${activeInfo.windowId}`);
        }
    });

    // This is fired off when a tab is discarded. This ensures we maintain consistent & accurate references
    // to tabs at all times.
    chrome.tabs.onReplaced.addListener(async (addedTabId, removedTabId) => {
        const [prevTimestamp, prevTabData] = await Promise.all([
            collections.tabDeactivationTimestamps.get(removedTabId),
            collections.windowActiveTabs.read(),
        ]);
        const prevActiveTabs = Object.entries(prevTabData);

        // If the replaced tab was an active one, this will be defined
        const [prevWindowId] = prevActiveTabs.find(([, value]) => value === removedTabId) ?? [];
        if (prevWindowId) {
            collections.windowActiveTabs.set({ [prevWindowId]: addedTabId });
        }

        if (prevTimestamp) {
            collections.tabDeactivationTimestamps.set({ [addedTabId]: prevTimestamp });
        }

        collections.tabDeactivationTimestamps.remove([removedTabId]);
        log.debug(`Replacement - Old Tab: ${removedTabId}, New Tab: ${addedTabId}, Window: ${prevWindowId}`);
    });

    chrome.tabs.onRemoved.addListener((tabId, { isWindowClosing, windowId }) => {
        collections.tabDeactivationTimestamps.remove([tabId]);
        if (isWindowClosing) collections.windowActiveTabs.remove([windowId]);
        log.debug(`Removal - Tab: ${tabId}, Window: ${windowId}`);
    });
};
