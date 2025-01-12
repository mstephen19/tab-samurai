import { PageEvent, type PageEventDataMap } from '../types';

const streamDetector = () => {
    const _getUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);

    const notifyLatestState = (state: PageEventDataMap[PageEvent.StreamStateChange]) =>
        window.postMessage({ type: PageEvent.StreamStateChange, data: state });

    const handleStream = (stream: MediaStream) => {
        const handleTracks = () => {
            const tracks = stream.getTracks();

            notifyLatestState({
                video: tracks.some((track) => track.kind === 'video'),
                audio: tracks.some((track) => track.kind === 'audio'),
            });

            // If every track in the stream is no longer live, the stream has ended
            if (tracks.length && tracks.every((track) => track.readyState !== 'live')) {
                stream.removeEventListener('addtrack', handleTracks);
                stream.removeEventListener('removetrack', handleTracks);
            }
        };

        stream.addEventListener('addtrack', handleTracks);
        stream.addEventListener('removetrack', handleTracks);
        handleTracks();
    };

    navigator.mediaDevices.getUserMedia = async (...args) => {
        const stream = await _getUserMedia(...args);

        handleStream(stream);

        return stream;
    };

    window.addEventListener('beforeunload', () => notifyLatestState({ video: false, audio: false }));
    // notifyLatestState({ video: false, audio: false });
};

streamDetector();
