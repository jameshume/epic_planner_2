import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import Classes from './App.module.css';
import PlannerGrid from './Components/PlannerGrid/PlannerGrid';
import PlannerSideBar from './Components/PlannerSideBar/PlannerSideBar';

async function signUp() {
    try {
        const { user } = await Auth.signUp({
            username: "",
            password: "",
        });
        console.log(user);
    } catch (error) {
        console.log('error signing up:', error);
    }
}

async function signIn(username, password) {
  try {
      const user = await Auth.signIn(username, password);
  } catch (error) {
      console.log('error signing in', error);
  }
}

async function signOut() {
  try {
      await Auth.signOut();
  } catch (error) {
      console.log('error signing out: ', error);
  }
}

const _STATES = Object.freeze({
    RUNNING: 0,
    SHOW_REGISTER: 1,
    SHOW_SIGNIN:2,
});

const _UserDefaultState = {
    username: null,
    token: null,
};

const _PageDefaultState = _STATES.RUNNING;


const App = (props) => {
    const [userState, setUserState] = useState(_UserDefaultState);
    const [pageState, setPageState] = useState(_PageDefaultState);
    const [emailState, setEmailState] = useState(null);
    const [passwordState, setPasswordState] = useState(null);

    return (
        <>
            <div className={Classes.user_dialog}
                style={{display: (pageState === _STATES.SHOW_SIGNIN ? "flex" : "none")}}
                onClick={() => setPageState(_STATES.RUNNING)}
            >
                <dialog open={pageState === _STATES.SHOW_SIGNIN}
                    onClick={(e) => {e.stopPropagation();}}
                >
                <h1
                    style={{margin: "0 0 15px 0"}}
                >Sign In</h1>
                    <div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 2fr"
                            }}
                        >
                            <label>Email: </label>
                            <input onChange={(e) => setEmailState(e.target.value)} value={emailState}
                                style={{marginBottom: "10px"}}
                            />
                            <label>Password: </label>
                            <input type="password" onChange={(e) => setPasswordState(e.target.value)} value={passwordState}
                                style={{marginBottom: "10px"}}
                            />
                        </div>
                        <div
                            style={{display: "flex", flexDirection: 'row-reverse'}}
                        >
                            <button
                                onClick={
                                    async () => {
                                        try {
                                            const user = await Auth.signIn(emailState, passwordState);
                                            setUserState({username: emailState, token: user})
                                            setPageState(_STATES.RUNNING)
                                        }
                                        catch (err) {
                                            alert(err.message);
                                        }
                                    }
                                }
                                style={{marginLeft: "10px"}}
                            >Sign In</button>
                            <button onClick={() => {setPageState(_STATES.RUNNING)}}>Cancel</button>
                        </div>
                    </div>
                </dialog>
            </div>

            <div className={Classes.App}>
                <header>
                    <div style={{width: "100%", height: "100%", "grid-template-columns": "1fr 1fr 1fr", display: "grid"}}>
                        <div style={{textAlign:"left",  margin: "auto 0 auto 1rem"}}>
                            {
                                userState.username !== null
                                    ? <>
                                        <button style={{marginRight: "0.25rem"}}>New</button>
                                        <button style={{marginRight: "0.25rem"}}>Save</button>
                                        <button>Load</button>
                                    </>
                                    : null
                            }
                        </div>
                        <div style={{textAlign:"center",  margin: "auto 0 auto 1rem"}}>
                            JEHTech EpicPlanner
                        </div>
                        <div style={{textAlign:"right",  margin: "auto 1rem auto 0"}}>
                            {
                                userState.username === null
                                    ? (<>
                                        <button style={{marginRight: "0.25rem"}}>Register</button>
                                        <button onClick={() => setPageState(_STATES.SHOW_SIGNIN)}>Sign In</button>
                                      </>)
                                    : <button
                                        onClick={
                                            () => {
                                                signOut();
                                                setUserState(_UserDefaultState);
                                            }
                                        }
                                      >Sign Out</button>
                            }
                        </div>
                    </div>
                </header>
                <main>
                    <PlannerGrid/>
                    <PlannerSideBar/>
                </main>
                <footer style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                    --- &#9400; JEHTech.com / JEH-Tech.com ---
                </footer>



            </div>
        </>
    );
}

export default App;
