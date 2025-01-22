import { createContext } from 'react';
import { store } from '../../storage';
import { storeProvider } from './StoreProvider';

export const UpdateContext = createContext<string | null>(null);

export const UpdateProvider = storeProvider({
    store: store.availableUpdateVersion,
    defaultValue: null,
    context: UpdateContext,
});
