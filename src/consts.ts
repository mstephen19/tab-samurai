import type { AppData, Config } from './types';

export const EXTENSION_VERSION = chrome.runtime.getManifest().version;

export const UNINSTALL_URL = 'https://forms.gle/VoMrWPXvMjXrC7Z4A';

export const FEATURE_REQUEST_URL = 'https://forms.gle/99eJ7TNeiMnwahyD6';

export const REPORT_BUG_URL = 'https://github.com/mstephen19/tab-samurai/issues';

export const CREATOR_LINKS = ['https://www.linkedin.com/in/mstephen19/', 'https://github.com/mstephen19'];

export const MANAGE_TABS_GROUP_OPTIONS = ['Domain', 'Window'] as const;

export const DISCARD_TABS_AFTER_MILLISECONDS_OPTIONS = {
    Instantly: 5,
    '5 mins': 60_000 * 5,
    '10 mins': 60_000 * 10,
    '15 mins': 60_000 * 15,
    '30 mins': 60_000 * 30,
    '1 hour': 60_000 * 60,
    '2 hours': 60_000 * 60 * 2,
    '3 hours': 60_000 * 60 * 3,
    '4 hours': 60_000 * 60 * 4,
    '5 hours': 60_000 * 60 * 5,
    '6 hours': 60_000 * 60 * 6,
};

export const HELP_AND_INFO_FAQ: { primary: string; secondary: string }[] = [
    {
        primary: 'What does it mean to "hibernate" a tab?',
        secondary:
            'Each open tab that you have is like a mini-application that\'s running on your computer. Having many running tabs may result in worse overall performance (e.g. slow loading, lagging, computer memory issues). While you can always close tabs, you may not always want to lose them. "Hibernating" tabs behave like closed tabs, with the benefit of not actually being closed.',
    },
    {
        primary: 'How do I customize which tabs should hibernate?',
        secondary:
            'Tab Samurai will auto-hibernate a tab once it hasn\'t been viewed for the duration specified within "Settings". You can add domains (e.g. "https://google.com") to the whitelist to ensure they don\'t hibernate. By default, pinned tabs don\'t hibernate; however this option can be switched to "Yes". Your active tab (the one you\'re looking at) will never hibernate. Tabs playing audio will also never hibernate.',
    },
    {
        primary: "Will I lose my tab's data when it hibernates?",
        secondary:
            "No, your tab's content will remain exactly as you left it. For example, if you were filling out a form, the data will still be there when the tab is reactivated, as long as the website supports it.",
    },
    {
        primary: 'How do I quickly open Tab Samurai?',
        secondary: `Use this keyboard shortcut to open this window: ${
            navigator.userAgent.includes('Mac') ? 'Command (⌘) + Shift + 0 (zero)' : 'Ctrl + Shift + 0 (zero)'
        }`,
    },
];

export const defaultConfig: Config = {
    discardTabsAfterMilliseconds: DISCARD_TABS_AFTER_MILLISECONDS_OPTIONS['1 hour'],
    discardPinnedTabs: false,
    whitelistedDomains: [],
};

export const defaultAppData: AppData = {
    theme: 'light',
    manageTabsGroupBy: 'Domain',
    userWelcomed: false,
    accordionState: {
        settings: false,
        quickActions: false,
        manage: false,
        info: false,
        recovery: false,
    },
};
