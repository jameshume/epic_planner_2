import React from 'react';

// Redux related imports
import { connect } from 'react-redux';
import * as actionTypes from '../../../../Store/Actions/actions';

// Component dependencies
import Classes from './CardBody.module.css';
import CommonClasses from '../../../../Common/Common.module.css';

class cardBody extends React.Component {
    render() {
        const [row_idx, col_idx, item_idx] = this.props.itemId;
        const data = this.props.grid[row_idx][col_idx][item_idx];

        return (
            <div className={[Classes.cardBody, CommonClasses.scrollable].join(" ")}>
                {data._title}
            </div>
        );
    }
}

// How state, managed by redux, should be mapped to props that can be accessed in this component
// The state parameter is the state as setup in reducedr.js so it will have those propertues.
const mapStateToProps = state => { // Func that expects the state, stored in redux and returns a map
  return {
      grid: state.grid._grid,
  };
}

// Which actions the container will dispatch
const mapDispatchToProps = dispatch => {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(cardBody);