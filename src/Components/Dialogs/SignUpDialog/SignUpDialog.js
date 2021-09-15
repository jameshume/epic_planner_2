import React, { useState } from 'react';
import PropTypes from 'prop-types';
import HeadedDialog from '../../../Containers/Dialogs/HeadedDialog/HeadedDialog';
import BusyDialog from '../../../Containers/Dialogs/BusyDialog/BusyDialog';
import ErrorFragment from '../../../Containers/Fragments/ErrorFragment/ErrorFragment';
import * as Auth from '../../../Services/Auth/Auth';
import GridForm from '../../GridForm/GridForm';
import {validateEmailFunc, validatePasswordFunc} from '../../GridForm/GridFromValidators';



const __STATES = Object.freeze({
    SIGN_UP: "sign up user",
    CONFIRM: "confirm user"
});



const EnterUsernameAndPasswordSignupDialog = (props) => {
    return (
        <HeadedDialog isOpen={props.isOpen} onClose={props.doClose} title="Sign Up">
            <p>
                Please enter the email address that you would like to use to log into
                your account. The password must be at least 8 characters long and
                contain at least 1 symbol, 1 number and 1 capital.
            </p>
            <p>
                Once you have registered, a confirmation code will be sent to you email
                address, which you must then enter to confirm your account. Once this is
                done you will be able to sign in.
            </p>
            <GridForm
                onSubmit={
                    (values) => {
                        props.setEmailValue(values['email']);
                        return props.doSignUp(values['email'], values['password']);
                    }
                }
                onCancel={() => props.doClose()}
                registerCloseListener={props.registerCloseListener}
                inputs={[
                    {
                        name: "email", label: "Email", type: "email", autocomplete: "email",
                        validateFunc: (values) => validateEmailFunc("email", values)
                    },
                    {
                        name: "password", label: "Password", type: "password",
                        autocomplete: "password",
                        validateFunc: (values) => validatePasswordFunc("password", values)
                    },
                    {
                        name: "password2", label: "Confirm Password", type: "password",
                        autocomplete: "password",
                        validateFunc: (values) => {
                            let result = validatePasswordFunc("password2", values);
                            if (
                                (result === null) &&
                                (values["password"] !== values["password2"])
                            ) {
                                result = "Passwords do not match"
                            }
                            return result;
                        }
                    }
                ]}
            >
            </GridForm>
            <ErrorFragment errorString={props.errorString}/>
        </HeadedDialog>
    );
};

EnterUsernameAndPasswordSignupDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    doClose: PropTypes.func.isRequired,
    setEmailValue: PropTypes.func.isRequired,
    emailValue: PropTypes.string.isRequired,
    setPasswordValue: PropTypes.func.isRequired,
    passwordValue: PropTypes.string.isRequired,
    errorString: PropTypes.string,
    doSignUp: PropTypes.func.isRequired,
    registerCloseListener:PropTypes.func.isRequired,
};



const ConfirmUserSignupDialog = (props) => (
    <HeadedDialog isOpen={props.isOpen} onClose={props.doClose} title="Sign Up">
        <p>
            An email has been sent to your email account, <code>{props.emailValue}</code>,
            with a confirmation code. Please enter that code below:
        </p>
        <GridForm
            onSubmit={values => props.doConfirm(props.emailValue, values["conf_code"])}
            onCancel={() => props.doClose()}
            registerCloseListener={props.registerCloseListener}
            inputs={[
                {
                    name: "conf_code", label: "Confirmation code", type: "input", autocomplete: "off",
                    validateFunc: (values) => null
                }
            ]}
        />
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
    </HeadedDialog>
);

ConfirmUserSignupDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    doClose: PropTypes.func.isRequired,
    emailValue: PropTypes.string.isRequired,
    setConfirmationCode: PropTypes.func.isRequired,
    confirmationCode: PropTypes.string.isRequired,
    errorString: PropTypes.string,
    doConfirm: PropTypes.func.isRequired,
    registerCloseListener:PropTypes.func.isRequired,
};



const SignUpDialog = (props) => {
    const [isBusy, setBusy] = useState(false);
    const [emailValue, setEmailValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [confirmationCode, setConfirmationCode] = useState("");
    const [errorString, setErrorString] = useState(null);
    const [op, setOp] = useState(__STATES.SIGN_UP);
    const [formResetFunc, setFormResetFunc] = useState(null);

    const doAction = async (actionFunc, completeFunc, completeState) => {
        setBusy(true);
        setErrorString(null);
        try {
            const result = await actionFunc();
            completeFunc(result);
            if (completeState !== null) { setOp(completeState); }
        }
        finally {
            setBusy(false);
        }
    };

    const doSignUp = async (username, password) => {
        console.debug(`doSignUp(${username}, ${password})`);
        try {
            await doAction(
                () => Auth.signUpUser(username, password),
                (result) => props.onSignedUp(username, result),
                __STATES.CONFIRM
            );
        }
        catch (err) {
            if (err.code === 'UsernameExistsException') {
                setErrorString(`Failed to sign up user: You have already signed up`);
            }
            else {
                setErrorString(`Failed to sign up user: ${err.message}`);
            }
        }
    };

    const doConfirm = (username, confirmationCode) => {
        try {
            doAction(
                () => Auth.confirmUser(username, confirmationCode),
                (result) => props.onConfirmed(username, result),
                __STATES.SIGN_UP
            );
        }
        catch (err) {
            setErrorString(`Failed to process confirmation code: ${err.message}`);
        }
    };

    const doClose = () => {
        console.debug("Closing sign up dialog");
        setOp(__STATES.SIGN_UP);
        setErrorString(null);
        setEmailValue("");
        setPasswordValue("");
        setConfirmationCode("");
        if ((formResetFunc !== undefined) && (formResetFunc !== null)) {
            formResetFunc();
        }
        props.onClose();
    };

    let dialogEl = null;

    if (isBusy) {
        dialogEl =  <BusyDialog isOpen={props.isOpen} onClose={doClose} title="Sign Up"/>
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
            registerCloseListener={(x) => setFormResetFunc(x)}
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
            registerCloseListener={(x) => setFormResetFunc(x)}
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