import React from "react";
import styles from "./styles/Modal.module.scss";

interface ModalProps {
    isOpen: boolean;
    children: React.ReactNode;
    closeModal: () => void;
}

const Modal = ({ isOpen, children, closeModal }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modal}>
            <div className={styles.modal__overlay} onClick={closeModal}></div>

            <div className={styles.modal__content}>
                <button className={styles.modal__close} onClick={closeModal}>
                    ✕
                </button>

                {children}
            </div>
        </div>
    );
};

export default Modal;