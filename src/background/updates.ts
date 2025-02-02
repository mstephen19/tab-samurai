import { store } from '../storage';

export const initialize = async () => {
    const [availableUpdateVersion, updateDetails] = await Promise.all([
        store.availableUpdateVersion.read(),
        chrome.runtime.requestUpdateCheck(),
    ]);

    const updateAvailable = updateDetails.status === 'update_available';
    // const throttled = updateDetails.status === 'throttled';

    // If an update is available & not already tracked
    if (updateAvailable && updateDetails.version !== availableUpdateVersion) {
        store.availableUpdateVersion.write(updateDetails.version);
    }

    // If an update isn't available but a version is still tracked
    if (!updateAvailable && availableUpdateVersion) {
        store.availableUpdateVersion.write(null);
    }

    chrome.runtime.onUpdateAvailable.addListener(({ version }) => {
        store.availableUpdateVersion.write(version);
    });
};
