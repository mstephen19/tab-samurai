import media from './media?script&module';
import { injectScript } from '../utils';

export const injectScripts = async () => void (await Promise.all([media].map((script) => injectScript(chrome.runtime.getURL(script)))));
