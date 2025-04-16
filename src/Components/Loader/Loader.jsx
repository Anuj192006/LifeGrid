import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import './Loader.css';

const Loader = () => {
    const [currentText, setCurrentText] = useState('');
    const [showContent, setShowContent] = useState(false);
    const texts = ['Set Tasks', 'Achieve It', 'Stay Motivated'];

    useEffect(() => {
        let textIndex = 0;
        const textInterval = setInterval(() => {
            if (textIndex < texts.length) {
                setCurrentText(texts[textIndex]);
                textIndex++;
            } else {
                clearInterval(textInterval);
                setShowContent(true);
            }
        }, 1000);

        return () => clearInterval(textInterval);
    }, []);

    return (
        <div className="loader-container">
            {!showContent ? (
                <div className="loader">
                    <p>{currentText}</p>
                </div>
            ) : (
                <Navigate to="/login" />
            )}
        </div>
    );
};

export default Loader;
