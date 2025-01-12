import type { TabStreamState } from '../types';

export enum PageEvent {
    StreamStateChange = 'streamStateChange',
}

export type PageEventDataMap = {
    [PageEvent.StreamStateChange]: TabStreamState;
};
