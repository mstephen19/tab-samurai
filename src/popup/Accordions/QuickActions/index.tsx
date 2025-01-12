import { useCallback, useContext, useMemo } from 'react';
import { TabsContext } from '../../context/TabsProvider';
import { Box, Button, type ButtonProps, styled } from '@mui/material';
import { ConfigContext } from '../../context/ConfigProvider';
import { pluralize, tabs as tabUtils } from '../../../utils';
import { toast } from '../../Toast';

const QuickActionButton = styled((props: ButtonProps) => <Button {...props} variant='outlined' />)({
    textTransform: 'none',
});

export const QuickActions = () => {
    const tabs = useContext(TabsContext);
    const config = useContext(ConfigContext);

    const allTabsDiscardedActiveOrWhitelisted = tabs.every((tab) => tab.discarded || tab.active || tabUtils.shouldWhitelist(tab, config));

    const handleSuspendInactiveTabs = useCallback(async () => {
        try {
            const inactiveTabs = tabs.filter((tab) => !tab.active && !tab.discarded && !tabUtils.shouldWhitelist(tab, config));

            await Promise.all(inactiveTabs.map((tab) => chrome.tabs.discard(tab.id!)));

            toast({
                type: 'success',
                message: `Hibernated ${inactiveTabs.length} inactive ${pluralize(inactiveTabs.length, 'tab', 'tabs')}.`,
            });
        } catch {
            toast({
                type: 'error',
                message: 'Failed to hibernate inactive tabs.',
            });
        }
    }, [tabs, config]);

    const someTabsAudible = tabs.some((tab) => tab.audible);

    const handleMuteMediaTabs = useCallback(async () => {
        try {
            const audibleTabs = tabs.filter((tab) => tab.audible);

            await Promise.all(audibleTabs.map((tab) => chrome.tabs.update(tab.id!, { muted: true })));

            toast({
                type: 'success',
                message: `Muted ${audibleTabs.length} audible ${pluralize(audibleTabs.length, 'tab', 'tabs')}.`,
            });
        } catch {
            toast({
                type: 'error',
                message: 'Failed to mute audible tabs.',
            });
        }
    }, [tabs]);

    const someTabsUnpinned = tabs.some((tab) => !tab.pinned && !tab.active);

    const handleCloseUnpinnedTabs = useCallback(async () => {
        try {
            const unpinnedTabs = tabs.filter((tab) => !tab.pinned && !tab.active);

            await Promise.all(unpinnedTabs.map((tab) => chrome.tabs.remove(tab.id!)));

            toast({
                type: 'success',
                message: `Closed ${unpinnedTabs.length} unpinned ${pluralize(unpinnedTabs.length, 'tab', 'tabs')}.`,
            });
        } catch {
            toast({
                type: 'error',
                message: 'Failed to close unpinned tabs.',
            });
        }
    }, [tabs]);

    const duplicateTabs = useMemo(() => tabUtils.getDuplicateTabs(tabs), [tabs]);

    const handleCloseDuplicateTabs = useCallback(async () => {
        try {
            await Promise.all(duplicateTabs.map((tab) => chrome.tabs.remove(tab.id!)));

            toast({
                type: 'success',
                message: `Closed ${duplicateTabs.length} duplicate ${pluralize(duplicateTabs.length, 'tab', 'tabs')}.`,
            });
        } catch {
            toast({
                type: 'error',
                message: 'Failed to close duplicate tabs.',
            });
        }
    }, [duplicateTabs]);

    return (
        <Box display='flex' flexDirection='column' gap='5px'>
            <QuickActionButton disabled={!duplicateTabs.length} onClick={handleCloseDuplicateTabs}>
                Close Duplicate Tabs
            </QuickActionButton>

            <QuickActionButton disabled={allTabsDiscardedActiveOrWhitelisted} onClick={handleSuspendInactiveTabs}>
                Hibernate All Inactive Tabs
            </QuickActionButton>

            <QuickActionButton disabled={!someTabsAudible} onClick={handleMuteMediaTabs}>
                Mute All Media-Playing Tabs
            </QuickActionButton>

            <QuickActionButton disabled={!someTabsUnpinned} onClick={handleCloseUnpinnedTabs}>
                Close All Unpinned Tabs
            </QuickActionButton>
        </Box>
    );
};
