import React, { useState } from 'react';
import PropTypes from 'prop-types';
import HeadedDialog from '../../../Containers/Dialogs/HeadedDialog/HeadedDialog';
import BusyDialog from '../../../Containers/Dialogs/BusyDialog/BusyDialog';
import * as Auth from '../../../Services/Auth/Auth';
import ErrorFragment from '../../../Containers/Fragments/ErrorFragment/ErrorFragment';
import GridForm from '../../GridForm/GridForm';
import {validateEmailFunc, validatePasswordFunc} from '../../GridForm/GridFromValidators';
import ForgotPasswordDialog from '../ForgotPasswordDialog/ForgotPasswordDialog';
import Classes from './SignInDialog.module.css';

const STATES = Object.freeze({
    SIGN_IN: 1,
    FORGOT_PASSWORD: 2,
});

const SignInDialogComponent = (props) => (
    <HeadedDialog isOpen={props.isOpen} onClose={props.doCancel} title="Sign In">
        <GridForm
            onSubmit={(values)=>props.doSignIn(values['email'], values['password'])}
            onCancel={props.doCancel}
            inputs={[
                {
                    name: "email", label: "Email", type: "email", autocomplete: "email",
                    validateFunc: (values) => validateEmailFunc("email", values),
                },
                {
                    name: "password", label: "Password", type: "password", autocomplete: "password",
                    validateFunc: (values) => validatePasswordFunc("password", values)
                }
            ]}
            reactKeyPrefix="SignInDialog_"
        />

        <div style={{fontSize: "small"}}>
            <a href="#" onClick={() => props.doForgotPassword}>
                Forgot password!
            </a>
        </div>

        <ErrorFragment errorString={props.errorString}/>
    </HeadedDialog>
);

SignInDialogComponent.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    doCancel: PropTypes.func.isRequired,
    doForgotPassword: PropTypes.func.isRequired,
    errorString: PropTypes.string,
    doSignIn:  PropTypes.func.isRequired,
};



const SignInDialog = (props) => {
    const [isBusy, setBusy] = useState(false);
    const [errorString, setErrorString] = useState(null);
    const [currentState, setCurrentState] = useState(STATES.SIGN_IN);

    const doSignIn = async (username, password) => {
        console.debug("Signing in...");
        setBusy(true);
        try {
            const token = await Auth.signIn(username, password);
            props.onSignedIn(username, token);
        }
        catch(err) {
            console.error(err);
            setErrorString(err.message);
        }
        finally {
            setBusy(false);
            console.debug("Done signing in");
        }
    };

    const doForgotPassword = () => {
        setCurrentState(STATES.FORGOT_PASSWORD);
    };

    const doCancel = (reason) => {
        setErrorString('');
        props.onClose(reason);
    }

    let dialogEl = null;

    if (isBusy) {
        dialogEl = (
            <BusyDialog
                isOpen={props.isOpen}
                onClose={doCancel}
                title="Sign In"
            />
        );
    }
    else if (currentState === STATES.SIGN_IN) {
        dialogEl = (
            <SignInDialogComponent
                isOpen={props.isOpen}
                doCancel={doCancel}
                doForgotPassword={doForgotPassword}
                errorString={errorString}
                doSignIn={doSignIn}
            />
        );
    }
    else {
        dialogEl = (
            <ForgotPasswordDialog
                isOpen={props.isOpen}
                onClose={props.onClose}
                email={props.email}
                errorString={props.errorString}
            />
        );
    }

    return dialogEl;
};

export default SignInDialog;

SignInDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSignedIn: PropTypes.func.isRequired,
};
