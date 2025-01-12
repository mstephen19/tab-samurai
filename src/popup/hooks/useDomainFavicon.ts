import { useEffect, useState } from 'react';
import log from '../log';

export const useDomainFavicon = (domain: string) => {
    const [objectUrl, setObjectUrl] = useState('');

    useEffect(() => {
        let objectUrl: string;
        const controller = new AbortController();

        const domainHost = new URL(domain).host;

        const hydrate = async () => {
            try {
                const res = await fetch(`https://logo.clearbit.com/${domainHost}`, {
                    signal: controller.signal,
                });

                objectUrl = URL.createObjectURL(await res.blob());

                setObjectUrl(objectUrl);
            } catch (err) {
                log.error(`Failed to fetch favicon for "${domain}"`, err);
            }
        };

        hydrate();

        return () => {
            controller.abort();
            URL.revokeObjectURL(objectUrl);
        };
    }, [domain]);

    return objectUrl;
};
