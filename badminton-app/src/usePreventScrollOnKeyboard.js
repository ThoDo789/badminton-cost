import { useEffect } from 'react';

const usePreventScrollOnKeyboard = () => {
    useEffect(() => {
        const handleFocus = () => {
            document.body.style.overflow = 'hidden';
        };

        const handleBlur = () => {
            document.body.style.overflow = 'auto';
        };

        const inputs = document.querySelectorAll('input, textarea');

        inputs.forEach(input => {
            input.addEventListener('focus', handleFocus);
            input.addEventListener('blur', handleBlur);
        });

        // Cleanup event listeners on unmount
        return () => {
            inputs.forEach(input => {
                input.removeEventListener('focus', handleFocus);
                input.removeEventListener('blur', handleBlur);
            });
        };
    }, []);
};

export default usePreventScrollOnKeyboard;
