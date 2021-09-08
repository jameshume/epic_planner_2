import React, { useState } from 'react';
import PropTypes from 'prop-types';
import HeadedDialog from '../../../Containers/Dialogs/HeadedDialog/HeadedDialog';
import Classes from './SaveAsDialog.module.css';

const SaveAsDialog = (props) => {
    const [filename, setFilename] = useState("");

    return (
        <HeadedDialog isOpen={props.isOpen} onClose={props.onClose} title="Save Plan As...">
            <label htmlFor="plan_name">Plan name:</label>
            <input name="plan_name" onChange={(evt) => setFilename(evt.target.value)} type="text"/>
            <button onClick={() => props.onSave(filename)}>Save</button>
            <button onClick={props.onClose}>Cancel</button>
        </HeadedDialog>
    );
};

SaveAsDialog.propTypes = {

};

export default SaveAsDialog;