import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '../../../Containers/Dialog/Dialog';
import Classes from './SaveAsDialog.module.css';

const SaveAsDialog = (props) => {
    const [filename, setFilename] = useState("");

    return (
        <Dialog isOpen={props.isOpen} onClose={props.onClose}>
            <div className={Classes.signInDialog}>
                <h1>Save Plan As...</h1>
                <label htmlFor="plan_name">Plan name:</label>
                <input name="plan_name" onChange={(evt) => setFilename(evt.target.value)} type="text"/>
                <button onClick={() => props.onSave(filename)}>Save</button>
                <button onClick={props.onClose}>Cancel</button>
            </div>
        </Dialog>
    );
};

SaveAsDialog.propTypes = {

};

export default SaveAsDialog;