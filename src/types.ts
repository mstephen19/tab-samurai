import type { MANAGE_TABS_GROUP_OPTIONS } from './consts';

export type Config = {
    discardTabsAfterMilliseconds: number;
    discardPinnedTabs: boolean;
    whitelistedDomains: string[];
};

export type AppData = {
    theme: 'light' | 'dark';
    manageTabsGroupBy: (typeof MANAGE_TABS_GROUP_OPTIONS)[number];
    userWelcomed: boolean;
    accordionState: {
        settings: boolean;
        quickActions: boolean;
        manage: boolean;
        info: boolean;
        recovery: boolean;
    };
};

export declare class TypedEventTarget<EventMap = Record<string, Event>> extends EventTarget {
    addEventListener<K extends keyof EventMap>(
        type: K,
        listener: (event: EventMap[K]) => void | Promise<void>,
        options?: AddEventListenerOptions | boolean
    ): void;
    addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean): void;

    removeEventListener<K extends keyof EventMap>(
        type: K,
        callback: (event: EventMap[K]) => void | Promise<void>,
        options?: EventListenerOptions | boolean
    ): void;
    removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void;

    dispatchEvent(event: Event): boolean;
}

export type TabStreamState = {
    video: boolean;
    audio: boolean;
};
