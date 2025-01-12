import { TextField } from '@mui/material';
import { type ChangeEventHandler, useContext, useState } from 'react';
import { ConfigContext } from '../../../context/ConfigProvider';
import { getUrlDomain } from '../../../../utils';
import { store } from '../../../../storage';

export const AddDomainBox = () => {
    const config = useContext(ConfigContext);

    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);

    const [validationError, setValidationError] = useState('');
    const showError = Boolean(validationError);

    const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setInputText(e.target.value.trim());
    };

    const handleAddDomain = async (text: string) => {
        setLoading(true);

        const trimmed = text.trim();

        const domain = getUrlDomain(trimmed);
        if (!domain) {
            setValidationError('Please enter a valid domain.');
            setLoading(false);
            return;
        }

        if (config.whitelistedDomains.includes(domain)) {
            setValidationError('This domain was already added.');
            setLoading(false);
            return;
        }

        await store.config.write({
            ...config,
            whitelistedDomains: [domain, ...config.whitelistedDomains],
        });

        setInputText('');

        setValidationError('');
        setLoading(false);
    };

    return (
        <TextField
            slotProps={{
                htmlInput: {
                    maxLength: 150,
                    autoComplete: 'off',
                    autoCapitalize: 'off',
                },
            }}
            variant='filled'
            fullWidth
            placeholder='https://example.com/'
            label='Enter Domain URI'
            value={inputText}
            onChange={handleInputChange}
            helperText={showError ? validationError : 'Press "Enter" to add your domain to the list.'}
            error={showError}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();

                    if (!loading) handleAddDomain(inputText);
                }
            }}
        />
    );
};
