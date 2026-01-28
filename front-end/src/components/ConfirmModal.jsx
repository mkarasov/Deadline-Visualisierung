import React from "react";
import classes from "./ConfirmModal.module.css";

const ConfirmModal = ({
    open,
    title,
    message,
    onConfirm,
    onCancel
}) => {
    if (!open) return null;

    return (
        <div className={classes.backdrop} onClick={onCancel}>
            <div
                className={classes.modal}
                onClick={(e) => e.stopPropagation()} 
            >
                <h3>{title}</h3>
                <p>{message}</p>

                <div className={classes.buttons}>
                    <button className={classes.modalButton} onClick={onCancel}>Abbrechen</button>
                    <button className={`${classes.modalButton} ${classes.danger}`} onClick={onConfirm}>
                        Löschen
                    </button>
                </div>
            </div>
        </div>


    )   
}

export default ConfirmModal;