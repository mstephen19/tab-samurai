import * as tabState from './tabState';
import * as tabDiscard from './tabDiscard';
import * as tabMetadata from './tabMetadata';
import * as cache from './cache';
import { defaultConfig, UNINSTALL_URL } from '../consts';

async function main() {
    tabMetadata.initialize();

    await Promise.all([
        // Tab discard is dependent on tabState & user config (Settings)
        tabState.initialize(),
        cache.config.init(defaultConfig),
    ]);

    tabDiscard.initialize();

    chrome.runtime.setUninstallURL(UNINSTALL_URL);
}

main();
