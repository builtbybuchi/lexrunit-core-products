import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-lg w-full text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-lex-med-blue opacity-10">404</h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="text-3xl font-bold text-lex-dark-blue">Page Not Found</h2>
                    </div>
                </div>

                <p className="text-gray-600 mb-2 text-lg">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <p className="text-gray-500 mb-8 font-mono bg-gray-100 p-2 rounded text-sm break-all">
                    URL: {typeof window !== 'undefined' ? window.location.href : ''}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-lex-med-blue hover:bg-lex-bright-blue transition-colors duration-200"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Back to Home
                    </a>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
