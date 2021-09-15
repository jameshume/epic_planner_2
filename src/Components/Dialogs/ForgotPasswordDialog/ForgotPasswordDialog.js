import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import HeadedDialog from '../../../Containers/Dialogs/HeadedDialog/HeadedDialog';
import BusyDialog from '../../../Containers/Dialogs/BusyDialog/BusyDialog';
import ErrorFragment from '../../../Containers/Fragments/ErrorFragment/ErrorFragment';
import * as Auth from '../../../Services/Auth/Auth';
import GridForm from '../../GridForm/GridForm';
import {validateEmailFunc, validatePasswordFunc} from '../../GridForm/GridFromValidators';

const STATES = Object.freeze({
    BUSY: 0,
    ENTER_EMAIL: 1,
    ENTER_RESET_CODE: 2,
});

const EnterEmailDialog = (props) => (
    <HeadedDialog isOpen={props.isOpen} onClose={props.onClose} title="Reset Your Password">
        <p>
            Enter your registered email address. An email will be sent to this address with a
            confirmation code that will allow you to reset your password.
        </p>
        <GridForm
            onSubmit={values => props.sendConfirmationCode(values['email'])}
            onCancel={props.onClose}
            inputs={[
                {
                    name: "email", label: "Email", type: "email", autocomplete: "email",
                    validateFunc: (values) => validateEmailFunc("email", values),
                },
            ]}
        >
        </GridForm>
        <ErrorFragment errorString={props.errorString}/>
    </HeadedDialog>
);

EnterEmailDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    sendConfirmationCode: PropTypes.func.isRequired,
    registerCloseListener: PropTypes.func.isRequired,
    errorString: PropTypes.string,
};



const EnterResetCodeDialog = (props) => (
    <HeadedDialog isOpen={props.isOpen} onClose={props.onClose} title="Reset Your Password">
        <p>
            A reset code has been sent to your registered email address. Please enter the Code
            below along with your new password:
        </p>
        <GridForm
            onSubmit={
                (values) => {
                    props.doConfirmPassword(props.email, values['code'], values['password']);
                }
            }
            onCancel={() => props.onClose()}
            inputs={[
                {
                    name: "code", label: "Code", type: "input", autocomplete: "off",
                    validateFunc: (values) => null
                },
                {
                    name: "password", label: "Password", type: "password",
                    autocomplete: "password",
                    validateFunc: (values) => validatePasswordFunc("password", values)
                },
                {
                    name: "password2", label: "Confirm password", type: "password",
                    autocomplete: "off",
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
        <a
            href="#"
            style={{fontSize: "small"}}
            onClick={(e) => {e.preventDefault(); props.sendConfirmationCode(props.email);}}
        >
            Resend confirmation code...
        </a>
        <ErrorFragment errorString={props.errorString}/>
    </HeadedDialog>
);

EnterResetCodeDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    sendConfirmationCode: PropTypes.func.isRequired,
    doConfirmPassword: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
    registerCloseListener: PropTypes.func.isRequired,
    errorString: PropTypes.string,
};



const ForgotPasswordDialog = (props) => {
    const [isBusy, setIsBusy] = useState(false);
    const [currentState, setCurrentState] = useState(STATES.ENTER_EMAIL);
    const [errorString, setErrorString] = useState(null);
    const [email, setEmail] = useState(null);
    const [formResetFunc, setFormResetFunc] = useState(null);

    let dialogEl = null;

    const _sendConfirmationCodeToUser = async (email) => {
        setEmail(email);
        setIsBusy(true);
        try {
            await Auth.userForgotPassword(email);
            setCurrentState(STATES.WAIT_RESET_CODE);
        }
        catch(err) {
            setErrorString(`Failed to send confirmation code: ${err.message}`);
        }
        finally {
            setIsBusy(false);
        }
    }
    const sendConfirmationCodeToUser = (email) => _sendConfirmationCodeToUser(email);

    const resetPassword = async (email, code, password) => {
        setIsBusy(true);
        try {
            await Auth.userConfirmPassword(email, code, password);
            setCurrentState(STATES.WAIT_RESET_CODE);
        }
        catch(err) {
            setErrorString(`Failed to send confirmation code: ${err.message}`);
        }
        finally {
            setIsBusy(false);
        }
    }

    const onClose = () => {
        if (formResetFunc !== null) {
            formResetFunc();
        }
        props.onClose();
    };

    if (isBusy) {
        const title = currentState === STATES.WAIT_RESET_CODE
            ? "Sending confirmation code" : "Resetting password";
        dialogEl =  <BusyDialog isOpen={props.isOpen} onClose={props.onClose} title={title}/>
    }
    else if(currentState === STATES.ENTER_EMAIL) {
        dialogEl = <EnterEmailDialog
            isOpen={props.isOpen}
            onClose={onClose}
            sendConfirmationCode={sendConfirmationCodeToUser}
            registerCloseListener={(x) => {setFormResetFunc(x)}}
            errorString={errorString}
        />
    }
    else {
        dialogEl = <EnterResetCodeDialog
            isOpen={props.isOpen}
            onClose={onClose}
            sendConfirmationCode={sendConfirmationCodeToUser}
            doConfirmPassword={resetPassword}
            registerCloseListener={(x) => {setFormResetFunc(x)}}
            email={email}
            errorString={errorString}
        />
    }

    return dialogEl;
};

ForgotPasswordDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ForgotPasswordDialog;
