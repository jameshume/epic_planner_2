import { ImmutableItemGrid, ImmutableItem } from '../../DataStructures/DataGrid/DataGrid';
import * as actionTypes from '../Actions/actions';

const initialSate = {
    selected_item: null,
    grid: new ImmutableItemGrid([
        [ [],                    [new ImmutableItem()] ],
        [ [new ImmutableItem()], [] ]
    ])
};

const moveRow = (state, action) => {
    const [row_idx, col_idx, item_idx] = action.item_id;
    let new_state = state;

    switch(action.direction) {
        case "up":
            if (row_idx > 1) { // Row_idx == 0 is the col headers
                new_state = {
                    selected_item: [row_idx - 1, col_idx, item_idx],
                    grid: state.grid.move_row(row_idx, row_idx - 1),
                };
            }
            break;
        case "down":
            if (row_idx < state.grid.get_num_rows() - 1) {
                new_state = {
                    selected_item: [row_idx + 1, col_idx, item_idx],
                    grid: state.grid.move_row(row_idx + 1, row_idx),
                };
            }
            break;
    }

    return new_state;
};

const moveColumn = (state, action) => {
    const [row_idx, col_idx, item_idx] = action.item_id;
    let new_state = state;

    switch(action.direction) {
        case "left":
            if (col_idx > 1) { // Col_idx == 0 is the row headers
                new_state = {
                    selected_item: [row_idx, col_idx - 1, item_idx],
                    grid: state.grid.move_col(col_idx, col_idx - 1),
                };
            }
            break;
        case "right":
            if (col_idx < state.grid.get_num_cols() - 1) {
                new_state = {
                    selected_item: [row_idx, col_idx + 1, item_idx],
                    grid: state.grid.move_col(col_idx + 1, col_idx),
                };
            }
            break;
    }

    return new_state;
}

const moveCard = (state, action) => {
    let new_state = state;
    const [row_idx, col_idx, item_idx] = action.item_id;
    const is_col_header = row_idx === 0;
    const is_row_header = col_idx === 0;

    if (is_col_header) {
        new_state = moveColumn(state, action)
    }
    else if (is_row_header) {
        new_state = moveRow(state, action);
    }
    else {
        switch(action.direction) {
            case "up":
                // When moving an item up, if it is at the top of its current row/col then it must,
                // if possible, move to the bottom of the row above, in the same col. When it is
                // not at the top of its row/col, it just moves one place up in that row/col.
                if (item_idx > 0) {
                    // Item moves within the same row/col
                    new_state = {
                        selected_item: [row_idx, col_idx, item_idx - 1],
                        grid: state.grid.move_item(
                            row_idx, col_idx, item_idx,
                            row_idx, col_idx, item_idx - 1
                        ),
                    };
                }
                else if((item_idx === 0) && (row_idx > 1)) {
                    // Item needs to move up a row in its column
                    new_state = {
                        selected_item: [
                            row_idx - 1, col_idx, state.grid.get_num_items(row_idx - 1, col_idx)
                        ],
                        grid: state.grid.move_item(
                            row_idx, col_idx, item_idx,
                            row_idx - 1, col_idx, state.grid.get_num_items(row_idx - 1, col_idx)
                        ),
                    };
                }
                break;
            case "down":
                // When moving an item down, if it is at the bottom of its current row/col then it
                // must, if possible, move to the top of the row below, in the same col. When it is
                // not at the bottom of its row/col, it just moves one place down in that row/col.
                if (item_idx < state.grid.get_num_items(row_idx, col_idx) - 1) {
                    // Item moves within the same row/col
                    new_state = {
                        selected_item: [row_idx, col_idx, item_idx + 1],
                        grid: state.grid.move_item(
                            row_idx, col_idx, item_idx + 1,
                            row_idx, col_idx, item_idx
                        ),
                    };
                }
                else if (row_idx < state.grid.get_num_rows() - 1) {
                    // Item needs to move down a row in its column
                    new_state = {
                        selected_item: [row_idx + 1, col_idx, 0],
                        grid: state.grid.move_item(
                            row_idx, col_idx, item_idx,
                            row_idx + 1, col_idx, 0
                        ),
                    };
                }
                break;
            case "left":
                // When moving an item left, in the most general terms, it moves to the column to
                // the left, staying, of course, in the same row. But, will also try to move it to
                // the same item-index in that column, if it exists, otherwise just to the bottom
                // of the group.
                if (col_idx > 1) { // Col 0 is for the row headings which cannot move!
                    let new_item_idx = item_idx;
                    const max_possible_new_item_idx = state.grid.get_num_items(row_idx, col_idx - 1);
                    if (new_item_idx > max_possible_new_item_idx) {
                        new_item_idx = max_possible_new_item_idx;
                    }
                    new_state = {
                        selected_item: [row_idx, col_idx - 1, new_item_idx],
                        grid: state.grid.move_item(
                            row_idx, col_idx, item_idx,
                            row_idx, col_idx - 1, new_item_idx
                        ),
                    };
                }
                break;
            case "right":
                // When moving an item right, in the most general terms, it moves to the column to
                // the right, staying, of course, in the same row. But, will also try to move it to
                // the same item-index in that column, if it exists, otherwise just to the bottom
                // of the group.
                if (col_idx < state.grid.get_num_cols() - 1) {
                    let new_item_idx = item_idx;
                    const max_possible_new_item_idx = state.grid.get_num_items(row_idx, col_idx + 1);
                    if (new_item_idx > max_possible_new_item_idx) {
                        new_item_idx = max_possible_new_item_idx;
                    }
                    new_state = {
                        selected_item: [row_idx, col_idx + 1, new_item_idx],
                        grid: state.grid.move_item(
                            row_idx, col_idx, item_idx,
                            row_idx, col_idx + 1, new_item_idx
                        ),
                    };
                }
                break;
            default:
                break;
        }
    }

    return new_state;
};

const reducer = (state=initialSate, action) => {
    let new_state;

    switch(action.type) {
        case actionTypes.CREATE_NEW_ITEM_BELOW:
            new_state = {
                ...state,
                grid: state.grid.add_item(...action.item_id, new ImmutableItem()),
            };
        break;

        case actionTypes.DELETE_ITEM:
            new_state = {
                selected_item: null,
                grid: state.grid.delete_item(...action.item_id)
            };
        break;

        case actionTypes.SELECT_ITEM:
            new_state = {
                ...state,
                selected_item: action.item_id
            }
        break;

            case actionTypes.SET_ITEM_TITLE:
            new_state = {
                ...state,
                grid: state.grid.set_item_property("_title", action.title, ...action.item_id)
            }
        break;

            case actionTypes.SET_ITEM_DESCRIPTION:
            new_state = {
                ...state,
                grid: state.grid.set_item_property(
                    "_description", action.description, ...action.item_id
                ),
            }
        break;

        case actionTypes.SET_ITEM_STORY_POINTS:
            new_state = {
                ...state,
                grid: state.grid.set_item_property(
                    "_story_points", action.story_points, ...action.item_id
                ),
            }
        break;

        case actionTypes.CREATE_NEW_COLUMN:
            new_state = {
                ...state,
                // When adding the column, must also add a blank header (ImmutableItem) as the
                // column header.
                grid: state.grid.add_col(action.column_idx).add_item(
                    0, action.column_idx, 0, new ImmutableItem()
                ),
            }
        break;

        case actionTypes.DELETE_COLUMN:
            new_state = {
                selected_item: null,
                grid: state.grid.delete_col(action.column_idx),
            }

            if (new_state.grid.get_num_cols() === 1) {
                // The only column is the left most single column, which houses the row headers.
                // As there must always be one column for cards, re-add a new column with a blank
                // header (ImmutableItem).
                new_state.grid = new_state.grid.add_col(1).add_item(0, 1, 0, new ImmutableItem());
            }
        break;

        case actionTypes.CREATE_NEW_ROW_ABOVE:
            new_state = {
                ...state,
                grid: state.grid.add_row(action.row_idx + 1).add_item(
                    action.row_idx + 1, 0, 0, new ImmutableItem()
                ),
            }
        break;

        case actionTypes.CREATE_NEW_ROW_BELOW:
            new_state = {
                ...state,
                grid: state.grid.add_row(action.row_idx).add_item(
                    action.row_idx, 0, 0, new ImmutableItem()
                ),
            }
        break;

        case actionTypes.DELETE_ROW:
            new_state = {
                selected_item: null,
                grid: state.grid.delete_row(action.row_idx),
            }

            if (new_state.grid.get_num_rows() === 1) {
                // The only row is the top most single row, which houses the column headers.
                // As there must always be one row for cards, re-add a new row with a blank
                // header (ImmutableItem).
                new_state.grid = new_state.grid.add_row(1).add_item(1, 0, 0, new ImmutableItem());
            }
        break;

        case actionTypes.MOVE_CARD:
            new_state = moveCard(state, action);
        break;

        default:
            new_state = state;
        break;
    }
    return new_state;
};

export default reducer;