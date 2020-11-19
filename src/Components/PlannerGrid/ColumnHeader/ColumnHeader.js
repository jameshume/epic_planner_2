import React from 'react';

// Redux related imports
import { connect } from 'react-redux';
import * as actionTypes from '../../../Store/Actions/actions';

import Classes from './ColumnHeader.module.css';
import InsertIcon from '../../Icons/InsertIcon';
import DeleteIcon from '../../Icons/DeleteIcon';
import CommonClasses from '../../../Common/Common.module.css';

function itemIdsAreEqual(lhs, rhs) {
    return (lhs[0] === rhs[0]) && (lhs[1] === rhs[1]) && (lhs[2] === rhs[2]);
}

class columnHeader extends React.Component {
    render() {
        const data = this.props.grid.get_item(0, this.props.column_id, 0);

        let barStyles = [Classes.columnHeaderBar];
        if (this.props.selected_item !== null && itemIdsAreEqual(this.props.selected_item, [0, this.props.column_id, 0])) {
            barStyles.push(Classes.columnHeaderBarSelected)
        }

        return (
            <div className={Classes.columnHeader}>
                <div
                    className={barStyles.join(' ')}
                    onClick = {() => this.props.onSelectItem([0, this.props.column_id, 0])}
                >
                    <div>
                        <InsertIcon
                            onClick={(e) => {
                                e.stopPropagation();
                                this.props.onCreateNewColumn(this.props.column_id)
                            }}
                        />
                    </div>
                    <div>
                        <DeleteIcon onClick={(e) => {
                                e.stopPropagation();
                                this.props.onDeleteColumn(this.props.column_id)
                            }}
                        />
                    </div>
                    <div>
                        <InsertIcon
                            onClick={(e) => {
                                e.stopPropagation();
                                this.props.onCreateNewColumn(this.props.column_id + 1)
                            }}
                        />
                    </div>
                </div>
                <div className={[Classes.columnHeaderContents, CommonClasses.scrollable].join(" ")}>
                    {data._title}
                </div>
            </div>
        );
    }
}

// How state, managed by redux, should be mapped to props that can be accessed in this component
// The state parameter is the state as setup in reducedr.js so it will have those propertues.
const mapStateToProps = state => { // Func that expects the state, stored in redux and returns a map
    return {
        selected_item: state.selected_item,
        grid: state.grid,
    };
}

// Which actions the container will dispatch
const mapDispatchToProps = dispatch => {
    return {
        onCreateNewColumn: column_idx => dispatch(actionTypes.createNewColumn(column_idx)),
        onDeleteColumn: column_idx => dispatch(actionTypes.deleteColumn(column_idx)),
        onSelectItem: item_id => dispatch(actionTypes.selectItem(item_id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(columnHeader);
