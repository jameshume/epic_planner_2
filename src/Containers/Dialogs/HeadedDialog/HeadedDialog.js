import PropTypes from 'prop-types';
import DialogBase from '../DialogBase/DialogBase';
import Classes from './HeadedDialog.module.css';

const HeadedDialog = (props) => (
  <DialogBase isOpen={props.isOpen} onClose={props.onClose}>
      <div className={Classes.headedDialog}>
          <h1>{props.title}</h1>
          {props.children}
      </div>
  </DialogBase>
);

HeadedDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export default HeadedDialog;