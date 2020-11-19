// The idea of the data structure isn't a bad one, however the cloning method used is inefficient.
// It can be "gotten away with" because the datasets are never likely to be large, however, if it
// were to be done properly, a library such as Immutable.js should be used to take advantage of
// effient immutable datastructure algorithms.

const IMMUTABLE_ITEM_DEFAULTS = Object.freeze({
    title: "",
    description: "",
    story_points: 0,
    importance: 0
})

export class ImmutableItem {
    constructor({title, description, story_points, importance} = IMMUTABLE_ITEM_DEFAULTS) {
        this._title = title;
        this._description = description;
        this._story_points = story_points;
        this._importance = importance;

        this.toString = this.toString.bind(this);
        this.clone = this.clone.bind(this);
    }

    toString() {
        return `[${this.constructor.name}: ${this._title}:${this._story_points}:${this._importance}]`;
    }

    clone() {
        return new ImmutableItem({
            title: this._title,
            description: this._description,
            story_points: this._story_points
        });
    }

    render() {
        throw new Error(`Cannot call render() of abstract base class ${this.constructor.name}`)
    }
}


// Grid is just an array of rows
export class ImmutableItemGrid {

    ////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(grid) {
        this._grid = grid || []; //[row][col][item]
        this._num_cols = 0;

        if (grid !== undefined && grid !== null) {
            this._num_cols = grid[0].length;
        }

        this.clone = this.clone.bind(this);

        this.get_num_rows = this.get_num_rows.bind(this);
        this.get_num_cols = this.get_num_cols.bind(this);
        this.get_num_items = this.get_num_items.bind(this);

        this.add_row = this.add_row.bind(this);
        this.delete_row = this.delete_row.bind(this);
        this.move_row = this.move_row.bind(this);

        this.add_col = this.add_col.bind(this);
        this.delete_col = this.delete_col.bind(this);
        this.move_col = this.move_col.bind(this);

        this.add_item = this.add_item.bind(this);
        this.delete_item = this.delete_item.bind(this);
        this.move_item = this.move_item.bind(this);
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////
    get_num_rows() {
        return this._grid.length;
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////
    get_num_cols() {
        return this._num_cols;
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////
    get_num_items(row, col) {
        return this._grid[row][col].length;
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Clone the entire grid.
    clone() {
        // grid is a list of lists of lists of items [ [ [i11, i21]], [i11, i22] ]
        let new_grid = new ImmutableItemGrid();
        new_grid._grid =
            this._grid.map(row =>
                row.map(col =>        // row is a list of lists of items
                    col.map(item =>   // col is a list of items
                        item.clone()  // item cloned
                    )
                )
            );
        new_grid._num_cols = this._num_cols;
        return new_grid;
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Converts to a string
    toString() {
        let str = "";
        for (const [ridx, row] of this._grid.entries()) {
            for(const [cidx, col] of row.entries()) {
                for(const [iidx, item] of col.entries()) {
                    str = str + `[${ridx}, ${cidx} ,${iidx}] = ${item.toString()} -- `;
                }
                str = str + "\n";
            }
        }
        return str;
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Returns a clone of the grid with a new, empty row added at index `row_idx` moving what was
    // in `row_idx`, and everything to the right of it, to the right by one position.
    //
    // For example, inserting a new row at index 1 produces this:
    //
    // 0 x x x x          0 x x x x
    // 1 x x x x   --->   1 n n n n   << New row added
    // 2 x x x x          2 x x x x
    //                    3 x x x x
    add_row(row_idx) {
        if ((row_idx < 0) || (row_idx > this._grid.length)) {
            throw new Error(
                `Cannot insert row after ${row_idx} as there ` +
                `are only ${this._grid.length} rows`
            );
        }

        let new_col = new Array(this._num_cols)
        for(let idx = 0; idx < new_col.length; ++idx) { new_col[idx] = [] }
        let new_grid = this.clone();
        new_grid._grid.splice(row_idx, 0, new_col);
        return new_grid;
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Returns a clone of the grid with the row at `row_idx` deleted, moving everthing below it up
    // by one.
    //
    // 0 x x x x          0 x x x x
    // 1 x x x x   <---   1 n n n n   << Row deleted
    // 2 x x x x          2 x x x x
    //                    3 x x x x
    delete_row(row_idx) {
        if ((row_idx < 0) || (row_idx >= this._grid.length)) {
            throw new Error(
                `Cannot delete row ${row_idx} as there are only ${this._grid.length} rows`
            );
        }

        let new_grid = this.clone();
        new_grid._grid.splice(row_idx, 1);
        return new_grid;
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Returns a clone of the grid with the row at `from_idx` moved to `to_idx`, with what was
    // at that index and below moved down by one.
    //
    // For example, move row 1 to row 3:
    // 0 x x x x          0 x x x x
    // 1 a a a a          1 x x x x
    // 2 x x x x   --->   2 a a a a
    // 3 b b b b          3 b b b b
    // 4 x x x x          4 x x x x
    move_row(from_idx, to_idx) {
        if (from_idx === to_idx) {
            throw new Error("Cannot move row to same row");
        }
        else if ((from_idx < 0) || (from_idx >= this._grid.length)) {
            throw new Error(`Cannot move row from ${from_idx}: out of bounds`);
        }
        else if ((to_idx < 0) || (to_idx > this._grid.length)) {
            throw new Error(`Cannot move row to row after ${to_idx}: out of bounds`);
        }

        let new_grid = this.clone();
        const adjust_for_row_movement = (to_idx > from_idx) ? 1 : 0;
        const deleted_row = new_grid._grid.splice(from_idx, 1);
        new_grid._grid.splice(to_idx - adjust_for_row_movement, 0, ...deleted_row);
        return new_grid;
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Add a column at `col_idx`. The column that was at `col_idx` is moved to the right.
    add_col(col_idx) {
        if ((col_idx < 0) || (col_idx > this._num_cols)) {
            throw new Error(`Cannot add col at index ${col_idx}: out of bounds`);
        }

        let new_grid = this.clone();
        for (let col of new_grid._grid) {
            col.splice(col_idx, 0, []);
        }
        new_grid._num_cols = new_grid._num_cols + 1;
        return new_grid;
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Deletes the column at `col_idx` by deleting the column from every row.
    delete_col(col_idx) {
        if ((col_idx < 0) || (col_idx >= this._num_cols)) {
            throw new Error(`Cannot delete col at index ${col_idx}: out of bounds`);
        }

        let new_grid = this.clone();
        for (let col of new_grid._grid) {
            col.splice(col_idx, 1);
        }
        new_grid._num_cols -= 1;
        return new_grid;
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Move a column by moving it in every row from `from_col_idx` to `to_col_idx`, where what was
    // in `to_col_idx` is moved right 1.
    //
    // For example...
    // Move col 0 to col 2           |    Move col 2 to col 0
    // 0 1 2 3 4        0 1 2 3 4    |    0 1 2 3 4      0 1 2 3 4
    // a b c d e ---->  b c a d e    |    a b c d e ---> d a b c e
    // a b c d e        b c a d e    |    a b c d e      d a b c e
    move_col(from_col_idx, to_col_idx) {
        if (
            (from_col_idx < 0) || (from_col_idx >= this._num_cols) ||
            (to_col_idx < 0) || (to_col_idx > this._num_cols)
        ) {
            throw new Error(`Cannot move col at index ${from_col_idx}: out of bounds`);
        }
        let new_grid = this.clone();
        const adjust_for_col_movement = (to_col_idx > from_col_idx) ? 1 : 0;
        for (let col of new_grid._grid) {
            const deleted_col = col.splice(from_col_idx, 1);
            col.splice(to_col_idx - adjust_for_col_movement, 0, ...deleted_col);
        }
        return new_grid;
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Return an object that will let the user iterate over that column.
    // Basically allows us to iterate by [col][row][item]
    col_view(col_idx) {
        const that = this;
        return new Proxy(this, {
            get: function(target, prop) {
                const idx = parseInt(prop);
                if (!isNaN(idx)) {
                    // The column idx is fixed by col_idx. Prop becomes the row_idx. Now need to
                    // return the item list.
                    return that._grid[prop][col_idx];
                }
                return undefined;
            }
        });
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////
    append_item(row_idx, col_idx, item) {
        if (
            ((row_idx < 0) || (row_idx > this._grid.length)) ||
            ((col_idx < 0) || (col_idx > this._num_cols))
        ) {
            throw new Error(`Append item to [${row_idx}][${col_idx}]: out of bounds`);
        }

        let new_grid = this.clone();
        new_grid._grid[row_idx][col_idx].push(item);
        return new_grid;
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////
    // TODO / FIXME - has off by one errors on upper bound deliberately(I think) to add at the
    // end of arrays. Need a better name for this function and a variant which doesn't have the
    // off by one.
    assert_grid_indicies_are_valid(row_idx, col_idx, item_idx) {
        if ((row_idx < 0) || (row_idx > this._grid.length)) {
            throw new Error(
                `Grid row out of bounds. ` +
                `Max row idx = ${this._grid.length}. Row idx requested = ${row_idx}.`
            );
        }

        if ((col_idx < 0) || (col_idx > this._num_cols)) {
            throw new Error(
                `Grid col out of bounds. ` +
                `Max col idx = ${this._num_cols}. Col idx requested = ${col_idx}.`
            );
        }

        if ((item_idx < 0) || (item_idx > this._grid[row_idx][col_idx].length)) {
            throw new Error(
                `Grid item out of bounds. ` +
                `Max item idx = ${this._grid[row_idx][col_idx].length}. ` +
                `Item idx requested = ${item_idx}.`
            );
        }
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Add an item to a specific row/col at the desired index. All items currently at that index
    // and greater are moved up one.
    add_item(row_idx, col_idx, item_idx, new_item) {
        this.assert_grid_indicies_are_valid(row_idx, col_idx, item_idx);
        let new_grid = this.clone();
        new_grid._grid[row_idx][col_idx].splice(item_idx, 0, new_item);
        return new_grid;
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Delete an item from a specific row/col.
    delete_item(row_idx, col_idx, item_idx) {
        this.assert_grid_indicies_are_valid(row_idx, col_idx, item_idx);
        let new_grid = this.clone();
        new_grid._grid[row_idx][col_idx].splice(item_idx, 1);
        return new_grid;
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Move an item from one location to another.
    move_item(
        from_row_idx, from_col_idx, from_item_idx,
        to_row_idx, to_col_idx, to_item_idx
    ) {
        this.assert_grid_indicies_are_valid(from_row_idx, from_col_idx, from_item_idx);
        this.assert_grid_indicies_are_valid(to_row_idx, to_col_idx, to_item_idx);

        const adjust_for_item_movement = (
            (from_row_idx !== to_row_idx) &&
            (from_col_idx !== to_col_idx) &&
            (to_item_idx > from_item_idx)
         ) ? 1 : 0;

        let new_grid = this.clone();
        const deleted_itm = new_grid._grid[from_row_idx][from_col_idx].splice(from_item_idx, 1);
        new_grid._grid[to_row_idx][to_col_idx].splice(
            to_item_idx - adjust_for_item_movement, 0, ...deleted_itm
        );
        return new_grid;
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////
    get_item(row_idx, col_idx, item_idx) {
        this.assert_grid_indicies_are_valid(row_idx, col_idx, item_idx);
        return this._grid[row_idx][col_idx][item_idx].clone();
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////
    set_item_property(property_name, property_value, row_idx, col_idx, item_idx) {
        this.assert_grid_indicies_are_valid(row_idx, col_idx, item_idx);
        let new_grid = this.clone();
        new_grid._grid[row_idx][col_idx][item_idx][property_name] = property_value;
        return new_grid;
    }
}
