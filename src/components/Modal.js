import React from 'react';

const Modal = ({ handleClose, show, children }) => {
    const showHideClassName = show
        ? 'modal display-block'
        : 'modal display-none';

    return (
        <div className={showHideClassName}>
            <section className="modal-main">
                {children}
            <button className="modal-close-button" onClick={handleClose}>
                    close
            </button>
            </section>
        </div>
    );
};

export default Modal;
