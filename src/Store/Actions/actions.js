export const CREATE_NEW_ITEM_BELOW = "CREATE_NEW_ITEM_BELOW";
export const DELETE_ITEM = "DELETE_ITEM";
export const SELECT_ITEM = "SELECT_ITEM";
export const SET_ITEM_TITLE = "SET_ITEM_TITLE";
export const SET_ITEM_DESCRIPTION = "SET_ITEM_DESCRIPTION";
export const SET_ITEM_STORY_POINTS = "SET_ITEM_STORY_POINTS";
export const CREATE_NEW_COLUMN = "CREATE_NEW_COLUMN";
export const DELETE_COLUMN = "DELETE_COLUMN";
export const CREATE_NEW_ROW_ABOVE = "CREATE_NEW_ROW_ABOVE";
export const CREATE_NEW_ROW_BELOW = "CREATE_NEW_ROW_BELOW";
export const DELETE_ROW = "DELETE_ROW";
export const MOVE_CARD = "MOVE_CARD"


export const createNewItemBelow = item_id => ({
    type: CREATE_NEW_ITEM_BELOW,
    item_id: item_id,
});

export const deleteItem = item_id => ({
    type: DELETE_ITEM,
    item_id: item_id,
});

export const selectItem = item_id => ({
    type: SELECT_ITEM,
    item_id: item_id,
});

export const setItemTitle = (item_id, title) => ({
    type: SET_ITEM_TITLE,
    item_id: item_id,
    title: title,
});

export const setItemDescription = (item_id, description) => ({
    type: SET_ITEM_DESCRIPTION,
    item_id: item_id,
    description: description,
});

export const setItemStoryPoints = (item_id, story_points) => ({
    type: SET_ITEM_STORY_POINTS,
    item_id: item_id,
    story_points: story_points,
});

export const createNewColumn = (column_idx) => ({
    type: CREATE_NEW_COLUMN,
    column_idx: column_idx,
});

export const deleteColumn = (column_idx) => ({
    type: DELETE_COLUMN,
    column_idx: column_idx,
});

export const createNewRowAbove = (row_idx) => ({
    type: CREATE_NEW_ROW_ABOVE,
    row_idx: row_idx,
});

export const createNewRowBelow = (row_idx) => ({
    type: CREATE_NEW_ROW_BELOW,
    row_idx: row_idx,
});

export const deleteRow = (row_idx) => ({
    type: DELETE_ROW,
    row_idx: row_idx,
});

export const moveCard = (item_id, direction) => ({
    type: MOVE_CARD,
    item_id: item_id,
    direction: direction
});
