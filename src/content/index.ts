import { injectScripts } from './injected';
import { page } from './page';
import { PageEvent } from './types';

page.addEventListener(PageEvent.StreamStateChange, ({ detail }) => {
    chrome.runtime.sendMessage({ type: PageEvent.StreamStateChange, data: detail });
});

injectScripts();
