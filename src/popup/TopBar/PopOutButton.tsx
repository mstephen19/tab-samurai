import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { IconButton, Tooltip } from '@mui/material';
import { POPUP_URL } from '../../consts';

const openPopOut = () => {
    const popOutWindow = window.open(
        POPUP_URL,
        '_blank',
        `width=600,
height=600,
popup=true,
menubar=false,
resizable=0`
    );

    popOutWindow?.addEventListener('DOMContentLoaded', () => window.close());
};

export const PopOutButton = () => {
    if (!window.menubar.visible) return null;

    return (
        <Tooltip title='Pop out' arrow placement='bottom'>
            <IconButton onClick={openPopOut}>
                <OpenInNewIcon />
            </IconButton>
        </Tooltip>
    );
};
