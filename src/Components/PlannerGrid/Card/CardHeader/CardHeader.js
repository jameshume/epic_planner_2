import React from 'react';

// Redux related imports
import { connect } from 'react-redux';
import * as actionTypes from '../../../../Store/Actions/EpicPlannerActions';

// Component dependencies
import Classes from './CardHeader.module.css';
import DeleteIcon from '../../../Icons/DeleteIcon';
import DescriptionIcon from '../../../Icons/DescriptionIcon';
import ImportanceIcon from '../../../Icons/ImportanceIcon';
import StoryPointsIcon from '../../../Icons/StoryPointsIcon';
import InsertIcon from '../../../Icons/InsertIcon';

function itemIdsAreEqual(lhs, rhs) {

    return (lhs[0] === rhs[0]) && (lhs[1] === rhs[1]) && (lhs[2] === rhs[2]);
}

class cardHeader extends React.Component {
    render() {
        const [row_idx, col_idx, item_idx] = this.props.itemId;
        const data = this.props.grid[row_idx][col_idx][item_idx];

        const descriptionEl =
            data._description && data._description.length
                ? <DescriptionIcon></DescriptionIcon>
                : null;

        let class_names = [Classes.cardHeader]
        if (
            this.props.selected_item !== null &&
            itemIdsAreEqual(this.props.selected_item, this.props.itemId)
        ) {
            class_names.push(Classes.cardHeaderSelected);
        }

        return (
            <div
                className={class_names.join(' ')}
                onClick={() => this.props.onSelectItem(this.props.itemId)}
            >
                <div>
                    <StoryPointsIcon points={data._story_points}></StoryPointsIcon>
                    {descriptionEl}
                    <ImportanceIcon importance={data._importance}></ImportanceIcon>
                </div>
                <div>
                    <InsertIcon onClick={(e) => {e.stopPropagation(); this.props.onCreateNewItemBelow(this.props.itemId)}}/>
                </div>
                <div>
                    <DeleteIcon onClick={(e) => {e.stopPropagation(); this.props.onDeleteItem(this.props.itemId)}}/>
                </div>
            </div>
        );
    }
};


// How state, managed by redux, should be mapped to props that can be accessed in this component
// The state parameter is the state as setup in reducedr.js so it will have those propertues.
const mapStateToProps = state => { // Func that expects the state, stored in redux and returns a map
    return {
        selected_item: state.epicPlanner.selected_item,
        grid: state.epicPlanner.grid._grid,
    };
}

// Which actions the container will dispatch
const mapDispatchToProps = dispatch => {
    return {
        onCreateNewItemBelow: item_id => dispatch(actionTypes.createNewItemBelow(item_id)),
        onDeleteItem: item_id => dispatch(actionTypes.deleteItem(item_id)),
        onSelectItem: item_id => dispatch(actionTypes.selectItem(item_id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(cardHeader);