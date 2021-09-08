import PropTypes from 'prop-types';
import Classes from './ErrorFragment.module.css';

const ErrorFragment = (props) => {
  let errorFragment = null;
  if (props?.errorString) {
      errorFragment = (<div className={Classes.errorFragment}>{props.errorString}</div>);
  }
  return errorFragment;
}

ErrorFragment.propTypes = {
  errorString: PropTypes.string,
};

export default ErrorFragment;