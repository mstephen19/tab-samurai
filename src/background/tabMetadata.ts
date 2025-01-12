import { PageEvent } from '../content/types';
import { TabStreamState } from '../types';
import { collections } from '../storage';

export const initialize = async () => {
    chrome.runtime.onMessage.addListener((message: { type: PageEvent.StreamStateChange; data: TabStreamState }, sender) => {
        collections.tabPageStates.set({
            [sender.tab!.id!]: message.data,
        });
    });

    const [pageStates, tabs] = await Promise.all([collections.tabPageStates.read(), chrome.tabs.query({})]);
    const initialTabIds = tabs.map(({ id }) => id!);

    // Remove page states for tabs that no longer exist
    await collections.tabPageStates.remove(Object.keys(pageStates).filter((key) => !initialTabIds.includes(+key)));

    chrome.tabs.onRemoved.addListener((tabId) => {
        collections.tabPageStates.remove([tabId]);
    });

    chrome.tabs.onReplaced.addListener((tabId) => {
        collections.tabPageStates.remove([tabId]);
    });
};
