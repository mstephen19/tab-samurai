import type { TypedEventTarget } from '../types';
import { PageEvent, type PageEventDataMap } from './types';

const pageEventList = Object.values(PageEvent);

const pageEvents = () => {
    const emitter = new EventTarget() as TypedEventTarget<{
        [K in PageEvent]: CustomEvent<PageEventDataMap[K]>;
    }>;

    window.addEventListener('message', (event) => {
        if (event.origin !== window.location.origin) return;
        if (!event.data || !pageEventList.includes(event.data.type)) return;

        emitter.dispatchEvent(new CustomEvent(event.data.type as PageEvent, { detail: event.data.data }));
    });

    return emitter;
};

export const page = pageEvents();
