import { Box, FormControlLabel, MenuItem, Select } from '@mui/material';
import { useContext } from 'react';
import { ConfigContext } from '../../context/ConfigProvider';
import { ConfigName } from '../../components/ConfigName';
import { store } from '../../../storage';
import { DISCARD_TABS_AFTER_MILLISECONDS_OPTIONS } from '../../../consts';
import { ConfigSwitch } from '../../components/ConfigSwitch';
import { DomainWhitelist } from './DomainWhitelist';

import type { Config } from '../../../types';

const discardTabsAfterOptions = Object.entries(DISCARD_TABS_AFTER_MILLISECONDS_OPTIONS);

export const Settings = () => {
    const config = useContext(ConfigContext);

    const changeHandler =
        <K extends keyof Config>(key: K) =>
        (value: Config[K]) => {
            store.config.write({
                ...config,
                [key]: value,
            });
        };

    return (
        <Box component='form' name='settings' display='flex' flexDirection='column' gap='10px'>
            <Box display='flex' flexDirection='column'>
                <ConfigName name='Hibernate Tabs After' tip='How long to wait before hibernating an un-viewed tab.' />

                <Select
                    size='small'
                    value={config.discardTabsAfterMilliseconds}
                    onChange={(e) => changeHandler('discardTabsAfterMilliseconds')(e.target.value as number)}>
                    {discardTabsAfterOptions.map(([label, value]) => (
                        <MenuItem key={`discard-after-${value}`} value={value}>
                            {label}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            <Box display='flex' flexDirection='column'>
                <ConfigName
                    name='Hibernate Pinned Tabs'
                    tip='Whether or not to hibernate pinned tabs. Tabs playing audio will never hibernate.'
                />

                <FormControlLabel
                    control={
                        <ConfigSwitch
                            onChange={(_, checked) => changeHandler('discardPinnedTabs')(checked)}
                            checked={config.discardPinnedTabs}
                        />
                    }
                    label={config.discardPinnedTabs ? 'Yes' : 'No'}
                />
            </Box>

            <DomainWhitelist />
        </Box>
    );
};
