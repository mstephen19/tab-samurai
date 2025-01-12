import { IconButton, ListItem, ListItemText } from '@mui/material';
import { memo, useContext } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { ConfigContext } from '../../../context/ConfigProvider';
import { store } from '../../../../storage';
import { DomainFavicon } from '../../../components/DomainFavicon';

const DomainListItem = memo(({ domain }: { domain: string }) => {
    const config = useContext(ConfigContext);

    const handleDelete = async () => {
        const copy = [...config.whitelistedDomains];
        copy.splice(copy.indexOf(domain), 1);

        await store.config.write({
            ...config,
            whitelistedDomains: copy,
        });
    };

    return (
        <ListItem
            disableGutters
            sx={{ gap: '10px' }}
            secondaryAction={
                <IconButton edge='end' onClick={handleDelete}>
                    <DeleteIcon />
                </IconButton>
            }>
            <DomainFavicon domain={domain} />

            <ListItemText
                primary={domain}
                slotProps={{
                    primary: {
                        sx: {
                            overflowWrap: 'break-word',
                        },
                    },
                }}
            />
        </ListItem>
    );
});

export default DomainListItem;
