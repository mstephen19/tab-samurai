import { collectionStorage } from '../../storage';
import { useEffect, useState, type Context, type ReactNode } from 'react';

export const collectionProvider = <Data,>({
    context,
    collection,
}: {
    context: Context<Record<string, Data | null>>;
    collection: ReturnType<typeof collectionStorage<Data>>;
}) => {
    return ({ children }: { children?: ReactNode }) => {
        const [data, setData] = useState<Record<string, Data | null>>({});

        useEffect(() => {
            const hydrate = async () => setData(await collection.read());

            const removeListener = collection.onChange(hydrate);

            hydrate();

            return removeListener;
        }, []);

        return <context.Provider value={data}>{children}</context.Provider>;
    };
};
