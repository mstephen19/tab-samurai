import { store, storageMemCache } from '../storage';

export const config = storageMemCache(store.config);
