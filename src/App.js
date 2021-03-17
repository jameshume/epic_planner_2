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
        userPoolWebClientId: '6knjms22fvbb3karqbk2ijbast',
        mandatorySignIn: true,
        cookieStorage: {
            domain: 'jehtech.com',
            path: '/',
            expires: 30,
            sameSite: "strict",
            secure: true
        },
        authenticationFlowType: 'USER_PASSWORD_AUTH',
        oauth: { //  Hosted UI configuration
            domain: 'your_cognito_domain',
            scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
            redirectSignIn: 'http://localhost:3000/',
            redirectSignOut: 'http://localhost:3000/',
            responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
        }
    }
});


function App() {
    return (
        <div className={Classes.App}>
            <AmplifySignOut />
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
                    <div style={{textAlign:"right",  margin: "auto 1rem auto 0"}}>
                        <button>Sign in</button>
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
