import PropTypes from 'prop-types';
import HeadedDialog from '../HeadedDialog/HeadedDialog';
import BarsSpinner from '../../BarsSpinner/BarsSpinner';

const BusyDialog = (props) => (
  <HeadedDialog isOpen={props.isOpen} onClose={props.onClose} title={props.title}>
    <BarsSpinner/>
  </HeadedDialog>
);

BusyDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

export default BusyDialog;