import { type ReactNode, useEffect, useState, type Context } from 'react';
import type { chromeStorage } from '../../storage';

/**
 * Creates a generic provider for use with a {@link chromeStorage} adapter.
 *
 * Initializes the store, and updates the context value when changes are detected.
 *
 * Will not render children until the store has been initialized. Assumes zero store errors.
 */
export function storeProvider<Data>({
    context,
    defaultValue,
    store,
    merge,
}: {
    context: Context<Data>;
    defaultValue: Data;
    store: ReturnType<typeof chromeStorage<Data>>;
    /**
     * Useful in cases where existing data is in the store, but the `defaultValue`
     * is updated with new properties not yet initialized in the store.
     *
     * To prevent cases where values are not initialized due to there being
     * existing data in the store, this function can merge the `fromStore` value
     * into `defaultValue` (ex. `{ ...defaultValue, ...fromStore }` for top-level)
     * structures only.
     */
    merge?: (fromStore: Data, defaultValue: Data) => Data;
}) {
    return ({ children }: { children?: ReactNode }) => {
        const [initialized, setInitialized] = useState(false);
        const [data, setData] = useState<Data>(defaultValue);

        useEffect(() => {
            // On initial render, populate store
            const hydrateStore = async () => {
                const pulledData = await store.read();

                if (pulledData) {
                    if (typeof merge === 'function') {
                        const merged = merge(pulledData, defaultValue);

                        // Write the latest merged in default data back to the store.
                        await store.write(merged);
                        setData(merged);

                        setInitialized(true);
                        return;
                    }

                    setData(pulledData);
                }
                // If there is no data in the store, initialize it with the default value
                // State is already initialized with this.
                else await store.write(defaultValue);

                setInitialized(true);
            };

            hydrateStore();

            // Detect storage-level changes and update component state
            const removeListener = store.onChange((latestData) => {
                setData(latestData);
            });

            return removeListener;
        }, []);

        // Don't render until the data has been initialized.
        // ! If loading from the store wasn't practically instant, would want to display a loading component here.
        return initialized ? <context.Provider value={data}>{children}</context.Provider> : null;
    };
}
