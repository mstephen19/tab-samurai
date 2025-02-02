import { Suspense, lazy, memo, useContext, useEffect } from 'react';
import sword from '../assets/sword.mp3';
import { AppDataContext } from './context/AppDataProvider';
import { store } from '../storage';

const Confetti = lazy(() => import('react-confetti'));

export const Welcome = memo(() => {
    const appData = useContext(AppDataContext);

    useEffect(() => {
        if (appData.userWelcomed) return;

        const audio = new Audio(chrome.runtime.getURL(sword));
        audio.volume = 0.5;
        audio.play();
        audio.remove();

        return () => {
            audio.pause();
            audio.remove();
        };
    }, [appData.userWelcomed]);

    if (appData.userWelcomed) return null;

    return (
        <Suspense fallback={null}>
            <Confetti
                recycle={false}
                run={!appData.userWelcomed}
                tweenDuration={2_500}
                opacity={0.8}
                width={600}
                height={600}
                gravity={0.45}
                initialVelocityX={4}
                initialVelocityY={15}
                numberOfPieces={200}
                colors={['#FFC238', '#C64635', '#FFD55D', '#70291E']}
                onConfettiComplete={() => {
                    store.appData.write({
                        ...appData,
                        userWelcomed: true,
                    });
                }}
            />
        </Suspense>
    );
});
