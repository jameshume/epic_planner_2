import React, { useState } from 'react';

// Redux related imports
import { connect, useSelector } from 'react-redux';

// Styles
import Classes from './App.module.css';

// Dialogs
import SignInDialog from './Components/Dialogs/SignInDialog/SignInDialog';
import SignUpDialog from './Components/Dialogs/SignUpDialog/SignUpDialog';
import SaveDialog from './Components/Dialogs/SaveDialog/SaveDialog';
import SaveAsDialog from './Components/Dialogs/SaveAsDialog/SaveAsDialog';

// Services
import * as Auth from  './Services/Auth/Auth';

// App Components
import PlannerGrid from './Components/PlannerGrid/PlannerGrid';
import PlannerSideBar from './Components/PlannerSideBar/PlannerSideBar';



const _STATES = Object.freeze({
    RUNNING:             0,
    SHOW_REGISTER:       1,
    SHOW_CONFIRM:        2,
    SHOW_SIGNIN_DIALOG:  3,
    SHOW_SAVE_DIALOG:    4,
    SHOW_SAVE_AS_DIALOG: 5,
});


const _PageDefaultState = _STATES.RUNNING;


const App = (props) => {
    const [userName, setUserName] = useState("");
    const [pageState, setPageState] = useState(_PageDefaultState);
    const grid = useSelector(state => state.grid);

    const savePlanAs = async (planName) => {
    };

    return (
        <>
            <SignUpDialog
                isOpen={pageState === _STATES.SHOW_REGISTER}
                onClose={() => setPageState(_STATES.RUNNING)}
                onSignedUp={(result)=> {}}
                onConfirmed={(result) => { setPageState(_STATES.SHOW_SIGNIN_DIALOG) }}
            />

            <SignInDialog
                isOpen={pageState === _STATES.SHOW_SIGNIN_DIALOG}
                onClose={() => setPageState(_STATES.RUNNING)}
                onSignedIn={(result) => { setUserName(result); setPageState(_STATES.RUNNING) }}
            />



            <div className={Classes.App}>
                <header>
                    <div style={{width: "100%", height: "100%", gridTemplateColumns: "1fr 1fr 1fr", display: "grid"}}>
                        <div style={{textAlign:"left",  margin: "auto 0 auto 1rem"}}>
                            {
                                Auth.getCurrentUser() !== null
                                    ? <>
                                        <button
                                            style={{marginRight: "0.25rem"}}
                                            onClick={() => {
                                                Auth.getCurrentUser()?.getSession((err, session) => {
                                                    console.error(err);
                                                    console.info(session);
                                                });
                                            }}
                                        >
                                            New
                                        </button>
                                        <button
                                            style={{marginRight: "0.25rem"}}
                                            onClick={() => setPageState(_STATES.SHOW_SAVE_DIALOG)}
                                        >
                                            Save
                                        </button>
                                        <button
                                            style={{marginRight: "0.25rem"}}
                                            onClick={() => setPageState(_STATES.SHOW_SAVE_AS_DIALOG)}
                                        >
                                            Save As
                                        </button>
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
                                Auth.getCurrentUser() === null
                                    ? (<>
                                        <button onClick={() => setPageState(_STATES.SHOW_REGISTER)} style={{marginRight: "0.25rem"}}>Sign Up</button>
                                        <button onClick={() => setPageState(_STATES.SHOW_SIGNIN_DIALOG)}>Sign In</button>
                                      </>)
                                    : <button
                                        onClick={
                                            async () => {
                                                await Auth.signOut();
                                                setUserName("");
                                                console.debug("Should now be signed out")
                                                console.debug(Auth.getCurrentUser())
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
