import GlobeIcon from '@mui/icons-material/Public';
import { useDomainFavicon } from '../hooks/useDomainFavicon';

export const Favicon = ({ url, size = '1.5rem' }: { url?: string; size?: string }) =>
    url ? (
        <img src={url} style={{ width: size, objectFit: 'contain' }} alt={`Favicon for ${url}`} />
    ) : (
        <GlobeIcon style={{ fontSize: size }} />
    );

export const DomainFavicon = ({ domain, size = '1.5rem' }: { domain: string; size?: string }) => {
    const faviconUrl = useDomainFavicon(domain);

    return <Favicon url={faviconUrl} size={size} />;
};
