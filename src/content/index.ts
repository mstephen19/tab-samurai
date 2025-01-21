import { injectScripts } from './injected';
import { page } from './page';
import { PageEvent } from './types';
import './listener/index';

page.addEventListener(PageEvent.StreamStateChange, ({ detail }) => {
    chrome.runtime.sendMessage({ type: PageEvent.StreamStateChange, data: detail });
});

injectScripts();
