import { collections } from '../../storage';
import { TabStreamState } from '../../types';
import { collectionProvider } from './CollectionProvider';
import { createContext } from 'react';

export const PageStateContext = createContext<Record<string, TabStreamState | null>>({});

export const PageStateProvider = collectionProvider({
    collection: collections.tabPageStates,
    context: PageStateContext,
});
