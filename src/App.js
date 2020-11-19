import Classes from './App.module.css';
import PlannerGrid from './Components/PlannerGrid/PlannerGrid';
import PlannerSideBar from './Components/PlannerSideBar/PlannerSideBar';
function App() {
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

export default App;
