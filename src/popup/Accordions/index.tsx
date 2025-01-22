import { Box, Divider } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import RestorePageIcon from '@mui/icons-material/RestorePage';
import { ConfigProvider } from '../context/ConfigProvider';
import { Settings } from './Settings';
import { TabsContext, TabsProvider } from '../context/TabsProvider';
import { QuickActions } from './QuickActions';
import { TabManager } from './TabManager';
import { Info } from './Info';
import { ManagedAccordion } from './ManagedAccordion';
import { PageStateProvider } from '../context/PageStateProvider';
import { useContext } from 'react';
import { SessionsProvider } from '../context/SessionsProvider';
import { TabRecovery } from './TabRecovery';

const SettingsAccordion = () => (
    <ManagedAccordion stateKey='settings' title='Settings' icon={<SettingsIcon />}>
        <Settings />
    </ManagedAccordion>
);

const QuickActionsAccordion = () => (
    <ManagedAccordion stateKey='quickActions' title='Quick Actions' icon={<RocketLaunchIcon />} unmountOnExit>
        <QuickActions />
    </ManagedAccordion>
);

const ManageTabsAccordion = () => {
    const tabs = useContext(TabsContext);

    return (
        <ManagedAccordion chip={tabs.length.toString()} stateKey='manage' title='Manage Tabs' icon={<ManageSearchIcon />} unmountOnExit>
            <TabManager />
        </ManagedAccordion>
    );
};

const RecoverTabsAccordion = () => (
    <ManagedAccordion stateKey='recovery' title='Tab Recovery' icon={<RestorePageIcon />} unmountOnExit>
        <TabRecovery />
    </ManagedAccordion>
);

const HelpAndInfoAccordion = () => (
    <ManagedAccordion stateKey='info' title='Help & Info' icon={<HelpCenterIcon />}>
        <Info />
    </ManagedAccordion>
);

export const Accordions = () => {
    return (
        // Not all of the components below depend on ConfigContext (only "Settings" & "QuickActions" do), but they're all being wrapped anyways
        // to prevent unwanted "flashing" behavior. This is because storeProvider won't render content until it's initialized.
        <ConfigProvider>
            <Box>
                <SettingsAccordion />

                <Divider flexItem />

                <TabsProvider>
                    <PageStateProvider>
                        <QuickActionsAccordion />

                        <Divider flexItem />

                        <ManageTabsAccordion />
                    </PageStateProvider>
                </TabsProvider>

                <Divider flexItem />

                <SessionsProvider>
                    <RecoverTabsAccordion />
                </SessionsProvider>

                <Divider flexItem />

                <HelpAndInfoAccordion />
            </Box>
        </ConfigProvider>
    );
};
