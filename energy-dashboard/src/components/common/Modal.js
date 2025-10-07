import React from 'react';
import { useModal } from '../../contexts/ModalContext';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = () => {
    const { isOpen, modalContent, closeModal } = useModal();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.aside
                    className="modal"
                    role="dialog"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeModal}
                >
                    <motion.div
                        className="modal-content large" // Add a 'large' class for custom modals
                        onClick={(e) => e.stopPropagation()}
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {/* Render the custom component directly if it exists, otherwise use the default structure */}
                        {modalContent.body ? (
                            modalContent.body
                        ) : (
                            <>
                                <div className="modal-header">
                                    <h3>{modalContent.title || 'Details'}</h3>
                                    <button className="modal-close" onClick={closeModal}>&times;</button>
                                </div>
                                <div className="modal-body">
                                    <p>No details available.</p>
                                </div>
                            </>
                        )}
                         {/* Add a generic close button for custom modals that don't have one */}
                         {!modalContent.body?.props?.poiData && <button className="modal-close-absolute" onClick={closeModal}>&times;</button>}
                    </motion.div>
                </motion.aside>
            )}
        </AnimatePresence>
    );
};

export default Modal;