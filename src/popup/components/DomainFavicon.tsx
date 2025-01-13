import GlobeIcon from '@mui/icons-material/Public';
import { useDomainFavicon } from '../hooks/useDomainFavicon';
import { memo, useCallback, useState } from 'react';

export const Favicon = memo(({ url, size = '1.5rem' }: { url?: string; size?: string }) => {
    const [hasError, setHasError] = useState(false);

    const handleError = useCallback(() => setHasError(true), []);

    return !hasError && url ? (
        <img src={url} style={{ width: size, objectFit: 'contain' }} alt={`Favicon for ${url}`} onError={handleError} />
    ) : (
        <GlobeIcon style={{ fontSize: size }} />
    );
});

export const DomainFavicon = ({ domain, size = '1.5rem' }: { domain: string; size?: string }) => {
    const faviconUrl = useDomainFavicon(domain);

    return <Favicon url={faviconUrl} size={size} />;
};
