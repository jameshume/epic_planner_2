import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '../../../Containers/Dialog/Dialog';
import BarsSpinner from '../../../Containers/BarsSpinner/BarsSpinner';
import Classes from './SignInDialog.module.css';

function yo() {
    
}

const SignInDialog = (props) => {
    const [isBusy, setBusy] = useState(false);
    const [emailValue, setEmailValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [errorString, setErrorString] = useState(null);

    const doSignIn = async (username, password) => {
        console.debug("Signing in...")
        setBusy(true);
        try {
            const token = await props.signInFunc(username, password);
            props.onSignIn(username, token);
        }
        catch(err) {
            console.error(err);
            setErrorString(err.message);
        }
        finally {
            setBusy(false);
            console.debug("Done signing in")
        }
    };

    const doCancel = () => {
        setEmailValue("");
        setPasswordValue("");
        setErrorString(null);
        props.onClose();
    }

    if (isBusy) {
        return (
            <Dialog isOpen={props.isOpen} onClose={doCancel}>
                <div className={Classes.signInDialog}>
                    <h1 style={{margin: "0 0 15px 0"}}>Sign In</h1>
                    <BarsSpinner/>
                </div>
            </Dialog>
        );
    }

    return (
        <Dialog isOpen={props.isOpen} onClose={doCancel}>
            <div className={Classes.signInDialog}>
                <h1 style={{margin: "0 0 15px 0"}}>Sign In</h1>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}>
                    <label htmlFor='signin_email'>Email:</label>
                    <input
                        onChange={(e) => setEmailValue(e.target.value)}
                        value={emailValue}
                        style={{marginBottom: "10px"}}
                        name='signin_email'
                    />

                    <label htmlFor='signin_password'>Password:</label>
                    <input
                        type="password"
                        onChange={(e) => setPasswordValue(e.target.value)}
                        value={passwordValue}
                        style={{marginBottom: "10px"}}
                        name='signin_password'
                        onKeyPress={
                            (event) => {
                                if(event.key === 'Enter'){
                                    doSignIn(emailValue, passwordValue)
                                }
                            }
                        }
                    />
                </div>

                <div style={{display: "flex", flexDirection: 'row-reverse'}}>
                    <button
                        onClick={ () => doSignIn(emailValue, passwordValue) }
                        style={{marginLeft: "10px"}}
                    >
                        Sign In
                    </button>
                    <button onClick={doCancel}>Cancel</button>
                </div>

                <div style={{fontSize: "small"}}>
                    <a href="#" onClick={yo}>Forgot password!</a>
                </div>

                {
                    (errorString === null)
                        ? null
                        : (<div style={{marginTop: "20px", padding: "0.5rem", background: 'red'}}>{errorString}</div>)
                }

            </div>
        </Dialog>
    );
};

export default SignInDialog;

SignInDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSignIn: PropTypes.func.isRequired,
    signInFunc: PropTypes.func.isRequired,
};
