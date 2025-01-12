import { createContext } from 'react';
import { store } from '../../storage';
import { storeProvider } from './StoreProvider';
import { defaultAppData } from '../../consts';

export const AppDataContext = createContext(defaultAppData);

export const AppDataProvider = storeProvider({
    store: store.appData,
    defaultValue: defaultAppData,
    context: AppDataContext,
    merge: (fromStore, defaultValue) => ({
        ...defaultValue,
        ...fromStore,
        accordionState: { ...defaultValue.accordionState, ...fromStore.accordionState },
    }),
});
