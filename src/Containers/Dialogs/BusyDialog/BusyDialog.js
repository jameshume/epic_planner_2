import PropTypes from 'prop-types';
import HeadedDialog from '../HeadedDialog/HeadedDialog';
import BarsSpinner from '../../BarsSpinner/BarsSpinner';

const BusyDialog = (props) => (
  <HeadedDialog isOpen={props.isOpen} onClose={props.doClose} title={props.title}>
    <BarsSpinner/>
  </HeadedDialog>
);

BusyDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  doClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

export default BusyDialog;