import React from 'react';

const LoadingSpinner = ({ text }) => (
    <div className="flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
        {text && <p className="text-sm text-blue-600 animate-pulse">{text}</p>}
    </div>
);

export default LoadingSpinner;