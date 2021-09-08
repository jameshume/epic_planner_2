import React from 'react';
import Classes from './DialogBase.module.css';
import PropTypes from 'prop-types';

const DialogBase = (props) => {
    const cssClassList = [Classes.dialogBaseBackground];
    cssClassList.push(props.isOpen ? Classes.dialogBaseVisible : Classes.dialogBaseHidden);
    return (
        <div className={cssClassList.join(' ')} onClick={props.onClose}>
            <dialog open={props.isOpen} onClick={(e) => e.stopPropagation()}>
                {props.children}
            </dialog>
        </div>
    );
};

DialogBase.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired
};

export default DialogBase;