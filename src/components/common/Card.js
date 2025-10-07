import React from 'react';

// A simple, reusable Card component.
const Card = ({ title, children, className = '' }) => {
    return (
        <article className={`card ${className}`}>
            {title && (
                <div className="card__header">
                    <h3>{title}</h3>
                </div>
            )}
            <div className="card__body">
                {children}
            </div>
        </article>
    );
};

export default Card;