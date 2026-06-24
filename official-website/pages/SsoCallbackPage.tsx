import React from 'react';
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';

const SsoCallbackPage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-lex-bg">
            <AuthenticateWithRedirectCallback />
        </div>
    );
};

export default SsoCallbackPage;
