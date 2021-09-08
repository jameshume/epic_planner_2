import React, { useState } from 'react';
import PropTypes from 'prop-types';
import HeadedDialog from '../../../Containers/Dialogs/HeadedDialog/HeadedDialog';
import BusyDialog from '../../../Containers/Dialogs/BusyDialog/BusyDialog';
import * as Auth from '../../../Services/Auth/Auth';
import ErrorFragment from '../../../Containers/Fragments/ErrorFragment/ErrorFragment';

__STATES = Object.freeze({
    GET_RESET_CODE: 1,
    RESET_PASSWORD: 2,
});



const SendResetCodeDialog = (props) => (
    <HeadedDialog isOpen={props.isOpen} onClose={props.doCancel} title="Recover Password">
        <p>
            Oops! Forgotten your password? Enter your email below and a reset code will be sent to
            you. This can then be used to change your password.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}>
            <label htmlFor='signin_email'>Email:</label>
            <input
                onChange={(e) => props.setEmailValue(e.target.value)}
                value={props.emailValue}
                style={{marginBottom: "10px"}}
                name='signin_email'
            />
            <div style={{display: "flex", flexDirection: 'row-reverse'}}>
                <button
                    onClick={ () => props.doSendResetCode(props.emailValue, props.passwordValue) }
                    style={{marginLeft: "10px"}}
                >
                    Send Code
                </button>
                <button onClick={props.doCancel}>Cancel</button>
            </div>
        </div>
    </HeadedDialog>
);



const ResetPasswordDialog = (props) => (
    <HeadedDialog isOpen={props.isOpen} onClose={props.doCancel} title="Recover Password">
        <p>
            A reset code has been send your email address. Enter the reset code and your new
            password below.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}>
            <label htmlFor=''>Reset Code:</label>
            <input
                onChange={(e) => props.setEmailValue(e.target.value)}
                value={props.emailValue}
                style={{marginBottom: "10px"}}
                name='signin_email'
            />
            <label htmlFor=''>New Password:</label>
            <input
                onChange={(e) => props.setEmailValue(e.target.value)}
                value={props.emailValue}
                style={{marginBottom: "10px"}}
                name='signin_email'
            />
            <label htmlFor=''>Confirm Password:</label>
            <input
                onChange={(e) => props.setEmailValue(e.target.value)}
                value={props.emailValue}
                style={{marginBottom: "10px"}}
                name='signin_email'
            />


            <div style={{display: "flex", flexDirection: 'row-reverse'}}>
                <button
                    onClick={ () => props.doSendResetCode(props.emailValue, props.passwordValue) }
                    style={{marginLeft: "10px"}}
                >
                    Send Code
                </button>
                <button onClick={props.doCancel}>Cancel</button>
            </div>
        </div>
    </HeadedDialog>
);



const ForgottenPasswordDialog = (props) => {
    const [isBusy, setBusy] = useState(false);
    const [emailValue, setEmailValue] = useState("");

    return (
            <ForgottenPasswordDialogBlah/>
    );
};