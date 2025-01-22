import { collections } from '../storage';
import * as cache from './cache';
import { store } from '../storage';
import { tabs as tabUtils, logger } from '../utils';

const log = logger('Scheduler', 'orange');

const tabDiscardScheduler = () => {
    const timeoutMap: Record<string, ReturnType<typeof setTimeout>> = {};

    const unschedule = (tabId: string | number) => {
        if (!(tabId in timeoutMap)) return;

        clearTimeout(timeoutMap[tabId]);
        delete timeoutMap[tabId];
        log.debug(`Unscheduled tab from being discarded: ${tabId}`);
    };

    const schedule = (tabId: string | number, timestamp: number | null, discardAfterMs: number) => {
        // If there's already a timeout, clear it to make way for the new one
        unschedule(tabId);

        // -1 timestamp means the tab is active and has no last deactivation time
        if (timestamp === -1 || !timestamp) return;

        const timeSinceDeactivatedMs = Date.now() - timestamp;
        const timeUntilDiscardMs = discardAfterMs - timeSinceDeactivatedMs;

        const discard = () => {
            chrome.tabs.discard(+tabId);
            log.debug(`Discarding tab: ${tabId}`);
        };

        if (timeUntilDiscardMs <= 0) return discard();
        log.debug(`Scheduled tab to be discarded in ${timeUntilDiscardMs}ms: ${tabId}`);

        timeoutMap[tabId] = setTimeout(discard, timeUntilDiscardMs);
    };

    return {
        unschedule,
        schedule,
        reschedule: async (discardAfterMs: number) => {
            const timestamps = await collections.tabDeactivationTimestamps.read();

            Object.keys(timeoutMap).forEach((tabId) => schedule(tabId, timestamps[tabId], discardAfterMs));
        },
    };
};

export const initialize = async () => {
    const tabWhitelist = new Set<number>();
    const scheduler = tabDiscardScheduler();

    const [timestamps, tabs] = await Promise.all([collections.tabDeactivationTimestamps.read(), chrome.tabs.query({})]);

    // Initial scheduling
    Object.entries(timestamps).forEach(([tabId, timestamp]) => {
        if (tabUtils.shouldWhitelist(tabs.find(({ id }) => id === +tabId)!, cache.config.latest!, cache.tabPageStates.latest)) {
            tabWhitelist.add(+tabId);
            return;
        }

        if (tabs.find(({ id }) => id === +tabId)?.discarded) return;

        scheduler.schedule(tabId, timestamp, cache.config.latest!.discardTabsAfterMilliseconds);
    });

    log.debug('Initialized');

    const handleTabActivationChange = async (tabId: string, timestamp: number | null, tab?: chrome.tabs.Tab) => {
        log.debug(`Activation Change - Tab: ${tabId}, Timestamp: ${timestamp}`);
        // If the tab is whitelisted
        // Or the tab is active
        // Or the tab is already discarded, ensure no schedule exists
        if (tabWhitelist.has(+tabId) || !timestamp || timestamp === -1 || (tab || (await chrome.tabs.get(+tabId))).discarded) {
            scheduler.unschedule(tabId);
            return;
        }

        scheduler.schedule(tabId, timestamp, cache.config.latest!.discardTabsAfterMilliseconds);
    };

    collections.tabDeactivationTimestamps.onChange(handleTabActivationChange);

    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
        // Discarded tabs are replaced. Remove data about them.
        if (changeInfo.discarded) return tabWhitelist.delete(tabId);

        const tab = await chrome.tabs.get(tabId);

        // If a change was made to the tab that means it should now be whitelisted, add to the whitelist
        if (tabUtils.shouldWhitelist(tab, cache.config.latest!, cache.tabPageStates.latest)) {
            scheduler.unschedule(tabId);
            tabWhitelist.add(tabId);
            return;
        }

        // If the tab was previously marked as should never discard, but that's now changed,
        // schedule the discard
        if (tabWhitelist.has(tabId)) {
            // Remove whitelist status
            tabWhitelist.delete(tabId);

            const timestamp = await collections.tabDeactivationTimestamps.get(tabId);

            scheduler.schedule(tabId, timestamp, cache.config.latest!.discardTabsAfterMilliseconds);
        }
    });

    cache.tabPageStates.onChange(async (tabId, state, latest) => {
        // Tab should be whitelisted if it's recording audio/video
        if (state && (state.audio || state.video)) {
            scheduler.unschedule(tabId);
            tabWhitelist.add(+tabId);
            return;
        }

        // Otherwise, shouldn't be in whitelist

        // If it is in the whitelist already though
        if (tabWhitelist.has(+tabId)) {
            const tab = await chrome.tabs.get(+tabId);

            // Check if other conditions say the tab should remain whitelisted, don't remove it
            if (tabUtils.shouldWhitelist(tab, cache.config.latest!, latest)) return;

            // Otherwise, remove it
            tabWhitelist.delete(+tabId);

            const timestamp = await collections.tabDeactivationTimestamps.get(tabId);

            scheduler.schedule(tabId, timestamp, cache.config.latest!.discardTabsAfterMilliseconds);
        }
    });

    store.config.onChange(async (latest, previous) => {
        switch (true) {
            default:
                break;
            // If discard time changes, reschedule all tab discards
            case previous?.discardTabsAfterMilliseconds !== latest.discardTabsAfterMilliseconds:
                scheduler.reschedule(latest.discardTabsAfterMilliseconds);
                break;
            case previous?.whitelistedDomains?.length !== latest.whitelistedDomains.length:
            case previous?.discardPinnedTabs !== latest.discardPinnedTabs: {
                const [timestamps, tabs] = await Promise.all([collections.tabDeactivationTimestamps.read(), chrome.tabs.query({})]);

                tabs.forEach((tab) => {
                    if (tab.discarded || !tab.id) return;

                    const tabAlreadyInWhitelist = tabWhitelist.has(tab.id);
                    const shouldAddToWhitelist = tabUtils.shouldWhitelist(tab, latest, cache.tabPageStates.latest);

                    // If the tab should be added to the whitelist, but is already in it, do nothing
                    // Improves performance by not iterating through every tab each time
                    if (tabAlreadyInWhitelist === shouldAddToWhitelist) return;

                    if (shouldAddToWhitelist) tabWhitelist.add(tab.id);
                    else tabWhitelist.delete(tab.id);

                    handleTabActivationChange(tab.id.toString(), timestamps[tab.id], tab);
                });

                break;
            }
        }
    });
};
