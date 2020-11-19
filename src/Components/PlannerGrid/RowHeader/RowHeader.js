import React from 'react';

// Redux related imports
import { connect } from 'react-redux';
import * as actionTypes from '../../../Store/Actions/actions';

import Classes from './RowHeader.module.css';
import InsertIcon from '../../Icons/InsertIcon';
import DeleteIcon from '../../Icons/DeleteIcon';
import CommonClasses from '../../../Common/Common.module.css';

function itemIdsAreEqual(lhs, rhs) {
    return (lhs[0] === rhs[0]) && (lhs[1] === rhs[1]) && (lhs[2] === rhs[2]);
}


class rowHeader extends React.Component {
    render() {
        const data = this.props.grid.get_item(this.props.row_id, 0, 0);

        let barStyles = [Classes.rowHeaderSideBar];
        if (this.props.selected_item !== null && itemIdsAreEqual(this.props.selected_item, [this.props.row_id, 0, 0])) {
            barStyles.push(Classes.rowHeaderSideBarSelected)
        }

        return (
            <div className={Classes.rowHeader}>
                <div
                    className={barStyles.join(' ')}
                    onClick = {() => this.props.onSelectItem([this.props.row_id, 0,0])}
                >
                    <InsertIcon
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                this.props.onCreateNewRowAbove(this.props.row_id)
                            }
                        }
                    />
                    <DeleteIcon
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                this.props.onDeleteRow(this.props.row_id)
                            }
                        }
                    />
                    <InsertIcon
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                this.props.onCreateNewRowBelow(this.props.row_id)
                            }
                        }
                    />
                </div>
                <div className={[Classes.rowHeaderContents, CommonClasses.scrollable].join(" ")}>
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
        onCreateNewRowAbove: row_idx => dispatch(actionTypes.createNewRowBelow(row_idx)),
        onCreateNewRowBelow: row_idx => dispatch(actionTypes.createNewRowAbove(row_idx)),
        onDeleteRow: row_idx => dispatch(actionTypes.deleteRow(row_idx)),
        onSelectItem: item_id => dispatch(actionTypes.selectItem(item_id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(rowHeader);
