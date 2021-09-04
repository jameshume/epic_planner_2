import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '../../../Containers/Dialog/Dialog';
import BarsSpinner from '../../../Containers/BarsSpinner/BarsSpinner';
import Classes from './SignUpDialog.module.css';
import * as Auth from '../../../Services/Auth/Auth';



const __STATES = Object.freeze({
    SIGN_UP: "sign up user",
    CONFIRM: "confirm user"
});



const BusySignUpDialog = (props) => (
    <Dialog isOpen={props.isOpen} onClose={props.doClose}>
        <div className={Classes.signUpDialog}>
            <h1 style={{margin: "0 0 15px 0"}}>Sign In</h1>
            <BarsSpinner/>
        </div>
    </Dialog>
);

BusySignUpDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    doClose: PropTypes.func.isRequired,
};



const ErrorFragment = (props) => {
    let errorFragment = null;
    if (props?.errorString) {
        errorFragment = (
            <div style={{marginTop: "20px", padding: "0.5rem", background: 'red'}}>
                {props.errorString}
            </div>
        );
    }
    return errorFragment;
}

ErrorFragment.propTypes = {
    errorString: PropTypes.string,
};



const EnterUsernameAndPasswordSignupDialog = (props) => (
    <Dialog isOpen={props.isOpen} onClose={props.doClose}>
        <div className={Classes.signUpDialog}>
            <h1 style={{margin: "0 0 15px 0"}}>Sign Up</h1>
            <p>
                Please enter the email address that you would like to use to log into
                your account. The password must be at least 8 characters long and
                contain at least 1 symbol, 1 number and 1 capital.
            </p>
            <p>
                Once you have registered a confirmation code will be sent to you email
                address, which you must then enter to confirm your account. Once this is
                done you will be automatically signed in.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}>
                <label htmlFor='sign_up_email'>Email:</label>
                <input
                    onChange={(e) => props.setEmailValue(e.target.value)}
                    value={props.emailValue}
                    style={{marginBottom: "10px"}}
                    name='sign_up_email'
                />

                <label htmlFor='sign_up_password'>Password:</label>
                <input
                    type="password"
                    onChange={(e) => props.setPasswordValue(e.target.value)}
                    value={props.passwordValue}
                    style={{marginBottom: "10px"}}
                    name='sign_up_password'
                    onKeyPress={
                        (event) => {
                            if(event.key === 'Enter') {
                                props.doSignUp(props.emailValue, props.passwordValue);
                            }
                        }
                    }
                />
            </div>

            <div style={{display: "flex", flexDirection: 'row-reverse'}}>
                <button
                    onClick={ () => props.doSignUp(props.emailValue, props.passwordValue) }
                    style={{marginLeft: "10px"}}
                >
                    Sign Up
                </button>
                <button onClick={props.doClose}>Cancel</button>
            </div>

            <ErrorFragment errorString={props.errorString}/>
        </div>
    </Dialog>
);

EnterUsernameAndPasswordSignupDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    doClose: PropTypes.func.isRequired,
    setEmailValue: PropTypes.func.isRequired,
    emailValue: PropTypes.string.isRequired,
    setPasswordValue: PropTypes.func.isRequired,
    passwordValue: PropTypes.string.isRequired,
    errorString: PropTypes.string,
    doSignUp: PropTypes.func.isRequired,
};



const ConfirmUserSignupDialog = (props) => (
    <Dialog isOpen={props.isOpen} onClose={props.doClose}>
        <div className={Classes.signUpDialog}>
            <h1 style={{margin: "0 0 15px 0"}}>Sign Up</h1>
            <p>
                An email has been sent to your email account, <code>{props.emailValue}</code>,
                with a confirmation code. Please enter that code below:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}>
                <label htmlFor='sign_up_code'>Confirmation Code:</label>
                <input
                    onChange={(e) => props.setConfirmationCode(e.target.value)}
                    value={props.confirmationCode}
                    style={{marginBottom: "10px"}}
                    name='sign_up_code'
                    onKeyPress={
                        (event) => {
                            if(event.key === 'Enter') {
                                props.doConfirm(props.emailValue, props.confirmationCode);
                            }
                        }
                    }
                />
            </div>

            <div style={{display: "flex", flexDirection: 'row-reverse'}}>
                <button
                    onClick={ () => props.doConfirm(props.emailValue, props.confirmationCode) }
                    style={{marginLeft: "10px"}}
                >
                    Confirm
                </button>
                <button onClick={props.doClose}>Cancel</button>
            </div>

            <p>
                <a
                    href="#"
                    style={{fontSize: "smaller"}}
                    onClick={() => Auth.resendConfirmationCode(props.emailValue)}
                >
                    Resend confirmation code...
                </a>
            </p>

            <ErrorFragment errorString={props.errorString}/>
        </div>
    </Dialog>
);

ConfirmUserSignupDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    doClose: PropTypes.func.isRequired,
    emailValue: PropTypes.string.isRequired,
    setConfirmationCode: PropTypes.func.isRequired,
    confirmationCode: PropTypes.string.isRequired,
    errorString: PropTypes.string,
    doConfirm: PropTypes.func.isRequired,
};



const SignUpDialog = (props) => {
    const [isBusy, setBusy] = useState(false);
    const [emailValue, setEmailValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [confirmationCode, setConfirmationCode] = useState("");
    const [errorString, setErrorString] = useState(null);
    const [op, setOp] = useState(__STATES.SIGN_UP);

    const doAction = async (actionFunc, completeFunc, completeState) => {
        setBusy(true);
        setErrorString(null);
        try {
            const result = await actionFunc();
            completeFunc(result);
            if (completeState !== null) { setOp(completeState); }
        }
        catch(err) {
            setErrorString(`Failed to ${completeState}: ${err.message}`);
        }
        finally {
            setBusy(false);
        }
    };

    const doSignUp = (username, password) => {
        console.debug(`doSignUp(${username}, ${password})`);
        doAction(
            () => Auth.signUpUser(username, password),
            (result) => props.onSignedUp(username, result),
            __STATES.CONFIRM
        );
    };

    const doConfirm = (username, confirmationCode) => {
        doAction(
            () => Auth.confirmUser(username, confirmationCode),
            (result) => props.onConfirmed(username, result),
            __STATES.SIGN_UP
        );
    };

    const doClose = () => {
        console.debug("Closing sign up dialog");
        setOp(__STATES.SIGN_UP);
        setErrorString(null);
        setEmailValue("");
        setPasswordValue("");
        setConfirmationCode("");
        props.onClose();
    };

    let dialogEl = null;

    if (isBusy) {
        dialogEl = <BusySignUpDialog isOpen={props.isOpen} doClose={doClose}/>
    }
    else if (op === __STATES.SIGN_UP) {
        dialogEl = <EnterUsernameAndPasswordSignupDialog
            isOpen={props.isOpen}
            doClose={doClose}
            setEmailValue={setEmailValue}
            emailValue={emailValue}
            setPasswordValue={setPasswordValue}
            passwordValue={passwordValue}
            doSignUp={doSignUp}
            errorString={errorString}
        />
    }
    else {
        dialogEl = <ConfirmUserSignupDialog
            isOpen={props.isOpen}
            doClose={doClose}
            emailValue={emailValue}
            setConfirmationCode={setConfirmationCode}
            confirmationCode={confirmationCode}
            doConfirm={doConfirm}
            errorString={errorString}
        />
    }

    return dialogEl;
};

SignUpDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSignedUp: PropTypes.func.isRequired,
    onConfirmed: PropTypes.func.isRequired,
};

export default SignUpDialog;