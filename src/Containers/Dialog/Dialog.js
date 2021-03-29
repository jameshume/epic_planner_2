import React, { useState } from 'react';
import Classes from './Dialog.module.css';
import PropTypes from 'prop-types';

const Dialog = (props) => (
    <div
        className={Classes.user_dialog}
        style={{display: (props.isOpen ? "flex" : "none")}}
        onClick={props.onClose}
    >
        <dialog
            open={props.isOpen}
            onClick={(e) => e.stopPropagation()}
        >
            {props.children}
        </dialog>
    </div>
);

Dialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired
};

export default Dialog;