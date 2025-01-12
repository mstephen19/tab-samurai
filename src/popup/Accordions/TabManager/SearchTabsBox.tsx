import { type ChangeEventHandler, memo, type MouseEventHandler, useCallback, useContext, useState } from 'react';
import { Box, IconButton, MenuItem, Paper, styled, TextField, Tooltip } from '@mui/material';
import CompressIcon from '@mui/icons-material/Compress';
import { HoverMenu } from '../../components/HoverMenu';
import { MANAGE_TABS_GROUP_OPTIONS } from '../../../consts';
import { AppDataContext } from '../../context/AppDataProvider';
import { AppData } from '../../../types';
import { store } from '../../../storage';

const StickyBox = styled(Box)({
    position: 'sticky',
    top: 0,
    zIndex: 1,
    display: 'flex',
    gap: '5px',
});

export const SearchTabsBox = memo(
    ({ value, onChange }: { value: string; onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> }) => {
        const appData = useContext(AppDataContext);

        const [anchor, setAnchor] = useState<HTMLElement | null>();
        const open = Boolean(anchor);

        const handleOpenMenu: MouseEventHandler<HTMLElement> = useCallback((e) => setAnchor(e.currentTarget), []);
        const handleCloseMenu = useCallback(() => setAnchor(null), []);

        const optionSelectHandler = useCallback(
            (option: AppData['manageTabsGroupBy']) => () => {
                store.appData.write({
                    ...appData,
                    manageTabsGroupBy: option,
                });

                handleCloseMenu();
            },
            [appData, handleCloseMenu]
        );

        return (
            <StickyBox>
                <Paper
                    sx={{
                        flex: 1,
                    }}>
                    <TextField
                        slotProps={{
                            htmlInput: {
                                maxLength: 150,
                                autoComplete: 'off',
                                autoCapitalize: 'off',
                            },
                        }}
                        variant='filled'
                        fullWidth
                        placeholder='reddit'
                        label='Search Your Tabs'
                        value={value}
                        onChange={onChange}
                    />
                </Paper>

                <Paper
                    elevation={3}
                    sx={{
                        display: 'flex',
                        placeItems: 'center',
                        border: '1px solid white',
                    }}>
                    <Tooltip arrow title='Group By' placement='top'>
                        <IconButton
                            onClick={handleOpenMenu}
                            disableRipple
                            size='small'
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                },
                            }}>
                            <CompressIcon />
                        </IconButton>
                    </Tooltip>
                </Paper>

                <HoverMenu anchorEl={anchor} open={open} onClose={handleCloseMenu}>
                    {MANAGE_TABS_GROUP_OPTIONS.map((option) => (
                        <MenuItem
                            key={`group-option-${option}`}
                            selected={option === appData.manageTabsGroupBy}
                            disableRipple
                            onClick={optionSelectHandler(option)}>
                            {option}
                        </MenuItem>
                    ))}
                </HoverMenu>
            </StickyBox>
        );
    }
);
