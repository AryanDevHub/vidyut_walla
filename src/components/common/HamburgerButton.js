import React from 'react';

const HamburgerButton = ({ onClick, isOpen }) => {
    return (
        <button
            className={`hamburger-button ${isOpen ? 'open' : ''}`}
            onClick={onClick}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
        >
            <span />
            <span />
            <span />
        </button>
    );
};

export default HamburgerButton;