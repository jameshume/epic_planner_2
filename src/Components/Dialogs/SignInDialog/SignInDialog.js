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
import { useEffect } from 'react/cjs/react.development';

const STATES = Object.freeze({
    SIGN_IN: 1,
    FORGOT_PASSWORD: 2,
});

const SignInDialogComponent = (props) => {
    const gridForm = (
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
            registerCloseListener={props.registerCloseListener}
        />
    );

    return (
        <HeadedDialog isOpen={props.isOpen} onClose={props.doCancel} title="Sign In">
            {gridForm}
            <div style={{fontSize: "small"}}>
                <a href="#" onClick={() => props.doForgotPassword()}>
                    Forgot password!
                </a>
            </div>

            <ErrorFragment errorString={props.errorString}/>
        </HeadedDialog>
    );
};

SignInDialogComponent.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    doCancel: PropTypes.func.isRequired,
    doForgotPassword: PropTypes.func.isRequired,
    errorString: PropTypes.string,
    doSignIn:  PropTypes.func.isRequired,
    registerCloseListener:PropTypes.func.isRequired,
};

const SignInDialog = (props) => {
    const [isBusy, setBusy] = useState(false);
    const [errorString, setErrorString] = useState(null);
    const [currentState, setCurrentState] = useState(STATES.SIGN_IN);
    const [formResetFunc, setFormResetFunc] = useState(null);

    const doSignIn = async (username, password) => {
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
        }
    };

    const doForgotPassword = () => {
        setCurrentState(STATES.FORGOT_PASSWORD);
    };

    const doCancel = (reason) => {
        setErrorString('');
        setCurrentState(STATES.SIGN_IN);
        if ((formResetFunc !== undefined) && (formResetFunc !== null)) {
            formResetFunc();
        }
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
                registerCloseListener={(x) => setFormResetFunc(x)}
            />
        );
    }
    else {
        dialogEl = (
            <ForgotPasswordDialog
                isOpen={props.isOpen}
                onClose={doCancel}
                email={props.email}
                errorString={props.errorString}
                registerCloseListener={setFormResetFunc}
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
