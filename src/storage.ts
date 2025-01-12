import type { AppData, Config, TabStreamState } from './types';

const enum StorageKey {
    Config = 'config',
    AppData = 'appData',
}

/**
 * Make & listen for changes on a single key within a {@link chrome.storage}.StorageArea.
 */
export const chromeStorage = <Data>(storage: chrome.storage.StorageArea, key: string) => {
    return {
        write: async (data: Data) => storage.set({ [key]: data }),
        read: async () => (await storage.get(key))[key] as Promise<Data | undefined>,
        onChange: (handler: (latest: Data, previous: Data | null) => void) => {
            const listener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
                // Only fire the handler for the key data it's prepared to handle
                if (!(key in changes)) return;
                handler(changes[key].newValue as Data, changes[key].oldValue as Data | null);
            };

            storage.onChanged.addListener(listener);

            return () => {
                storage.onChanged.removeListener(listener);
            };
        },
    };
};

/**
 * {@link chromeStorage} subscriber.
 *
 * Cache a readable copy of the {@link chromeStorage} API. Updates the cache when `onChange` fires.
 *
 * Provides a realtime view of a store, allowing immediate access to the latest data.
 */
export const storageMemCache = <Data>(api: ReturnType<typeof chromeStorage<Data>>) => {
    let latest: Data | null = null;

    return {
        init: async (defaultValue: Data) => {
            // Not merging any newest config changes
            // Not necessary, because Popup handles merges. Must open popup to use script anyways.
            latest = (await api.read()) ?? null;

            if (latest === null) {
                await api.write(defaultValue);
                latest = defaultValue;
            }

            api.onChange((latestData) => (latest = latestData));
        },
        get latest() {
            return latest;
        },
    };
};

export const store = {
    config: chromeStorage<Config>(chrome.storage.sync, StorageKey.Config),
    appData: chromeStorage<AppData>(chrome.storage.sync, StorageKey.AppData),
};

const enum CollectionName {
    TabDeactivationTimestamps = 'TabDeactivationTimestamps',
    WindowActiveTabs = 'WindowActiveTabs',
    TabPageState = 'TabPageState',
}

/**
 * Groups keys in a {@link chrome.storage.StorageArea} into a collection using compound keys.
 *
 * Allows for separation of concerns while maintaining atomicity at the collection level.
 *
 * For storing all values in one mega-object under one key, use {@link chromeStorage}.
 */
export const collectionStorage = <Data>(storage: chrome.storage.StorageArea, collectionName: string) => {
    const compoundKeyPrefix = `collection_${collectionName}+`;

    const compoundKey = (key: string | number) => `${compoundKeyPrefix}${key}`;

    return {
        get: async (key: string | number) => {
            const target = compoundKey(key);

            const { [target]: data } = await storage.get(target);

            return (data || null) as Data | null;
        },
        set: async (partial: Record<string, Data>) =>
            storage.set(Object.fromEntries(Object.entries(partial).map(([key, value]) => [compoundKey(key), value]))),
        remove: async (keys: (string | number)[]) => storage.remove(keys.map(compoundKey)),
        read: async () =>
            Object.entries(await storage.get(null))
                .filter(([key]) => key.startsWith(compoundKeyPrefix))
                .reduce<Record<string, Data>>((acc, [key, value]) => {
                    acc[key.replace(compoundKeyPrefix, '')] = value as Data;
                    return acc;
                }, {}),
        onChange: (handler: (key: string, data: Data | null) => void) => {
            const listener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
                Object.entries(changes)
                    .filter(([key]) => key.startsWith(compoundKeyPrefix))
                    .forEach(([key, value]) => handler(key.replace(compoundKeyPrefix, ''), (value.newValue ?? null) as Data | null));
            };

            storage.onChanged.addListener(listener);

            return () => {
                storage.onChanged.removeListener(listener);
            };
        },
    };
};

export const collections = {
    /**
     * TabID -> Timestamp
     *
     * Timestamps refer to when the tab was last unfocused
     *
     * Active tabs should have a timestamp of -1
     */
    tabDeactivationTimestamps: collectionStorage<number>(chrome.storage.local, CollectionName.TabDeactivationTimestamps),
    /**
     * WindowID -> TabID
     *
     * Keeps track of which TabID is active in each window
     */
    windowActiveTabs: collectionStorage<number>(chrome.storage.local, CollectionName.WindowActiveTabs),
    tabPageStates: collectionStorage<TabStreamState>(chrome.storage.local, CollectionName.TabPageState),
};
