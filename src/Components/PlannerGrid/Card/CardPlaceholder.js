import React from 'react';

// Redux related imports
import { connect } from 'react-redux';
import * as actionTypes from '../../../Store/Actions/actions';

import Classes from './Card.module.css';
import CommonClasses from '../../../Common/Common.module.css';

class placeholderCard extends React.Component {
  render() {
    return (
      <div
          className={[Classes.card, Classes.placeholder, CommonClasses.noselect].join(' ')}
          onClick={() => this.props.onCreateNewItemBelow(this.props.itemId)}
      >
        Click to add first card...
      </div>
    );
  }
};


// Which actions the container will dispatch
const mapDispatchToProps = dispatch => {
  return {
      onCreateNewItemBelow: item_id => dispatch(actionTypes.createNewItemBelow(item_id)),
  };
};

export default connect(null, mapDispatchToProps)(placeholderCard);