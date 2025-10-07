import React from 'react';
import Card from './Card';

const SkeletonCard = () => (
    <Card>
        <div className="skeleton-line title" />
        <div className="skeleton-line value" />
        <div className="skeleton-line change" />
    </Card>
);

export default SkeletonCard;