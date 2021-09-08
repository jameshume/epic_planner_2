import React, { useState } from 'react';
import PropTypes from 'prop-types';
import HeadedDialog from '../../../Containers/Dialogs/HeadedDialog/HeadedDialog';
import BusyDialog from '../../../Containers/Dialogs/BusyDialog/BusyDialog';
import * as Auth from '../../../Services/Auth/Auth';
import Classes from './SignInDialog.module.css';
import ErrorFragment from '../../../Containers/Fragments/ErrorFragment/ErrorFragment';



const EnterUsernameAndPasswordSignInDialog = (props) => (
    <HeadedDialog isOpen={props.isOpen} onClose={props.doCancel} title="Sign In">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}>
            <label htmlFor='signin_email'>Email:</label>
            <input
                onChange={(e) => props.setEmailValue(e.target.value)}
                value={props.emailValue}
                style={{marginBottom: "10px"}}
                name='signin_email'
            />

            <label htmlFor='signin_password'>Password:</label>
            <input
                type="password"
                onChange={(e) => props.setPasswordValue(e.target.value)}
                value={props.passwordValue}
                style={{marginBottom: "10px"}}
                name='signin_password'
                onKeyPress={
                    (event) => {
                        if(event.key === 'Enter'){
                            props.doSignIn(props.emailValue, props.passwordValue)
                        }
                    }
                }
            />
        </div>

        <div style={{display: "flex", flexDirection: 'row-reverse'}}>
            <button
                onClick={ () => props.doSignIn(props.emailValue, props.passwordValue) }
                style={{marginLeft: "10px"}}
            >
                Sign In
            </button>
            <button onClick={props.doCancel}>Cancel</button>
        </div>

        <div style={{fontSize: "small"}}>
            <a href="#" onClick={props.doForgotPassword}>Forgot password!</a>
        </div>

        <ErrorFragment errorString={props.errorString}/>
    </HeadedDialog>
);

const SignInDialog = (props) => {
    const [isBusy, setBusy] = useState(false);
    const [emailValue, setEmailValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [errorString, setErrorString] = useState(null);

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

    const doForgotPassword = async (username) => {
        console.debug("Forgot password...");
        setBusy(true);
        try {
            await Auth.userForgotPassword(username);
        }
        catch(err) {
            console.error(err);
            setErrorString(err.message);
        }
        finally {
            setBusy(false);
            console.debug("Done forgot password");
        }
    }

    const doCancel = () => {
        setEmailValue("");
        setPasswordValue("");
        setErrorString(null);
        props.onClose();
    }

    if (isBusy) {
        return (
            <BusyDialog isOpen={props.isOpen} onClose={doCancel} title="Sign In"/>
        );
    }

    return (
        <EnterUsernameAndPasswordSignInDialog
            isOpen={props.isOpen}
            doCancel={doCancel}
            emailValue={emailValue}
            setEmailValue={setEmailValue}
            passwordValue={passwordValue}
            setPasswordValue={setPasswordValue}
            errorString={errorString}
            doSignIn={doSignIn}
            doForgotPassword={doForgotPassword}
        />
    );
};

export default SignInDialog;

SignInDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSignedIn: PropTypes.func.isRequired,
};
