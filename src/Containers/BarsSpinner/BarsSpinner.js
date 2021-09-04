import Classes from './BarsSpinner.module.css';

const barsSpinner = (props) => (
  <div style={{height: "5em"}} >
    <div className={Classes.loader}>Loading...</div>
  </div>
);

export default barsSpinner;