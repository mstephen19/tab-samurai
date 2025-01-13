import { useMemo } from 'react';

export const useDomainFavicon = (domain: string) =>
    useMemo(() => {
        const domainOrigin = new URL(domain).origin;

        return `https://www.google.com/s2/favicons?domain=${domainOrigin}&sz=64`;
    }, [domain]);
