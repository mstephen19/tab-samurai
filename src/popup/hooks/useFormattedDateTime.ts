import { useMemo } from 'react';

const dateTimeFormatter = new Intl.DateTimeFormat(navigator.language, {
    dateStyle: 'short',
    timeStyle: 'short',
});

export const useFormattedDateTime = (unixMilliseconds?: number) =>
    useMemo(() => (unixMilliseconds ? dateTimeFormatter.format(new Date(unixMilliseconds)) : null), [unixMilliseconds]);
