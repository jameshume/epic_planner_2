import Classes from './BarsSpinner.module.css';

const barsSpinner = (props) => (
  <div {...props} className={Classes.loader}>Loading...</div>
);

export default barsSpinner;