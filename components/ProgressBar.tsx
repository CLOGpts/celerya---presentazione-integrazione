
import React from 'react';

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
    if (currentStep === 0 || totalSteps === 0) return null;

    const progressPercentage = (currentStep / totalSteps) * 100;

    return (
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div
                className="h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%`, backgroundColor: '#3B74B8' }}
            ></div>
        </div>
    );
};

export default ProgressBar;
