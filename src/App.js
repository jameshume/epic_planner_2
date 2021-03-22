import React from 'react';

import Amplify, { Auth } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import Classes from './App.module.css';
import PlannerGrid from './Components/PlannerGrid/PlannerGrid';
import PlannerSideBar from './Components/PlannerSideBar/PlannerSideBar';

Amplify.configure({
    Auth: {
        region: 'us-east-1',
        userPoolId: 'us-east-1_79qI7j2wz',
        userPoolWebClientId: '332d6s8mq87na571o9aebi7ri',
        mandatorySignIn: true,
        // TODO - Adding cookie storage stops the withAuthenticator displaying the app because
        //        presumably it searches for a user in the cookie storage if its available but
        //        doesn't find one. Maybe without it, it uses localStorage??
        //cookieStorage: {
        //    domain: '.jehtech.com',
        //    path: '/',
        //    expires: 30,
        //    sameSite: "strict",
        //    secure: true
        //},
        authenticationFlowType: 'USER_PASSWORD_AUTH',
    }
});


const App = () => {
    return (
        <div className={Classes.App}>
            
            <header>
                <div style={{width: "100%", height: "100%", "grid-template-columns": "1fr 1fr 1fr", display: "grid"}}>
                    <div style={{textAlign:"left",  margin: "auto 0 auto 1rem"}}>
                        <button style={{marginRight: "0.25rem"}}>New</button>
                        <button style={{marginRight: "0.25rem"}}>Save</button>
                        <button>Load</button>
                    </div>
                    <div style={{textAlign:"center",  margin: "auto 0 auto 1rem"}}>
                        JEHTech EpicPlanner
                    </div>
                    <div style={{textAlign:"right",  width: "10px", margin: "auto 1rem auto 0"}}>
                        <div>
                        <AmplifySignOut></AmplifySignOut>
                        </div>
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
    );
}

export default withAuthenticator(App);
