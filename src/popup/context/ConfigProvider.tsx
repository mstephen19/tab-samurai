import { createContext } from 'react';
import { store } from '../../storage';
import { storeProvider } from './StoreProvider';
import { defaultConfig } from '../../consts';

export const ConfigContext = createContext(defaultConfig);

export const ConfigProvider = storeProvider({
    store: store.config,
    defaultValue: defaultConfig,
    context: ConfigContext,
    merge: (fromStore, defaultValue) => ({ ...defaultValue, ...fromStore }),
});
