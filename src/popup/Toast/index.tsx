import { memo, useCallback, useEffect, useRef, useState } from 'react';
import type { TypedEventTarget } from '../../types';
import { Alert, Box } from '@mui/material';

type ToastOptions = {
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
    durationMs?: number;
};

const toastEvents = new EventTarget() as TypedEventTarget<{
    toast: CustomEvent<ToastOptions>;
}>;

export const toast = (options: ToastOptions) => {
    toastEvents.dispatchEvent(new CustomEvent('toast', { detail: options }));
};

type ToasterProps = {
    position?: 'top' | 'bottom';
    filled?: boolean;
};

export const Toaster = memo(({ position = 'top', filled = false }: ToasterProps) => {
    const [, setRenderValue] = useState('');
    const forceRender = useCallback(() => setRenderValue(Math.random().toString()), []);

    const toasts = useRef(new Map<string, ToastOptions>());

    const addToast = useCallback(
        (id: string, options: ToastOptions) => {
            toasts.current.set(id, options);
            forceRender();
        },
        [forceRender]
    );

    const removeToast = useCallback(
        (id: string) => {
            toasts.current.delete(id);
            forceRender();
        },
        [forceRender]
    );

    useEffect(() => {
        const handler = (event: CustomEvent<ToastOptions>) => {
            const id = crypto.randomUUID();
            const options = event.detail;

            addToast(id, options);
            setTimeout(() => removeToast(id), options.durationMs || 3_500);
        };

        toastEvents.addEventListener('toast', handler);

        return () => toastEvents.removeEventListener('toast', handler);
    }, [addToast, removeToast]);

    const toastList = [...toasts.current];

    return (
        <Box
            gap='10px'
            width={'clamp(200px, calc(100dvw - 20px), 800px)'}
            zIndex={10}
            top={position === 'top' ? '10px' : undefined}
            bottom={position === 'top' ? undefined : '10px'}
            sx={{ left: '50%', transform: 'translateX(-50%)', userSelect: 'none' }}
            position='fixed'
            display='flex'
            flexDirection={position === 'top' ? 'column' : 'column-reverse'}
            justifyContent={position === 'top' ? 'flex-start' : 'flex-end'}>
            {toastList.map(([id, { type, message }]) => (
                <Alert key={`toast-${id}`} severity={type} variant={filled ? 'filled' : 'standard'}>
                    {message}
                </Alert>
            ))}
        </Box>
    );
});
