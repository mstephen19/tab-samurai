import { store, storageMemCache, collections, collectionMemCache } from '../storage';

export const config = storageMemCache(store.config);
export const tabPageStates = collectionMemCache(collections.tabPageStates);
