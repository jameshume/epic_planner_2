import React, { useState } from 'react';
import PropTypes from 'prop-types';
import HeadedDialog from '../../../Containers/Dialogs/HeadedDialog/HeadedDialog';
import BusyDialog from '../../../Containers/Dialogs/BusyDialog/BusyDialog';
import * as Auth from '../../../Services/Auth/Auth';
import ErrorFragment from '../../../Containers/Fragments/ErrorFragment/ErrorFragment';
import GridForm from '../../GridForm/GridForm';
import Classes from './SignInDialog.module.css';


const EnterUsernameAndPasswordSignInDialog = (props) => (
    <HeadedDialog isOpen={props.isOpen} onClose={props.doCancel} title="Sign In">
        <GridForm
            onSubmit={(values)=>props.doSignIn(values['email'], values['password'])}
            onCancel={props.doCancel}
            inputs={[
                {
                    name: "email", label: "Email", type: "email",
                    validateFunc: (value) => value.includes("@") ? null : "Invalid email address"
                },
                {
                    name: "password", label: "Password", type: "password",
                    validateFunc: (value) => value.length > 5 ? null : "Password too short"
                }
            ]}
            reactKeyPrefix="SignInDialog_"
        />

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
