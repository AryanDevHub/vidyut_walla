import React from 'react';
import { motion } from 'framer-motion';

// A reusable wrapper component to animate sections as they appear.
const AnimatedSection = ({ children, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedSection;