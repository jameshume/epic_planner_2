class ImmutableItem {
    constructor({title, description, story_points} = {tite: "", description: "", story_points: 0}) {
        this._title = title;
        this._description = description;
        this._story_points = story_points;
    }

    clone() {
        return new ImmutableItem(this._title, this._description, this._story_points);
    }
}

// Column is just an array of items
class ImmutableCol {
    constructor(num_items) {
        this._items = new Array(num_items);
        for (let idx = this._items.length; ++idx) {
            this._items[idx] = new ImmutableItem();
        }
    }

    clone() {
        let new_col = new ImmutableCol(0);
        new_col._items = this._items.map(item => item.clone());
        return new_col;
    }
}

// Row is just an array of columns
class ImmutabeRow {
    constructor(num_cols) {
        this._cols = new Array(num_cols);
        for (let idx = this._cols.length; ++idx) {
            this._cols[idx] = new ImmutableCol();
        }
    }

    clone() {
        let new_row = ImmutabeRow(0)
        new_row._cols = this._cols.map(col = col.clone());
        return new_row;
    }

    add_col(after_this_col_idx) {
        let new_cols = this._cols.slice(0, after_this_col_idx).map(col => col.clone());
        new_cols.push(new ImmutableCol());
        new_cols.push(this._cols.slice(after_this_col_idx).map(col => col.clone()));
        let new_row = ImmutableRow(0)
        new_row._cols = new_cols;
        return new_row;
    }

    delete_col(col_idx) {
        let new_row = ImmutableRow(0);
        new_row._cols = this._cols.filter((col, idx) => idx != col_idx).map(col => col.clone());
        return new_row;
    }

    move_col(from_col_idx, to_after_this_col_idx) {
        if (from_col_idx === to_after_this_col_idx) {
            throw new Error("Cannot move column from and to same index");
        }

        let new_row = ImmutableRow(0);

        if (from_col_idx < to_after_this_col_idx) {
            let new_cols = this._cols.filter(
                (_, idx) => idx < from_col_idx
            ).map(col => col.clone());
            new_cols.push(
                this._cols.filter(
                    (_, idx) => (idx > from_col_idx) && (idx <= to_after_this_col_idx)
                ).map(col => col.clone())
            );
            new_cols.push(this._cols[from_col_idx].clone());
            new_cols.push(
                this._cols.filter(
                    (_, idx) => (idx > to_after_this_col_idx)
                ).map(col => col.clone())
            );
            new_row._cols = new_cols;
        }
        else {
            let new_cols = this._cols.filter(
                (_, idx) => idx <= to_after_this_col_idx
            ).map(col => col.clone());
            new_cols.push(this._cols[from_col_idx].clone());
            new_cols.push(
                this._cols.filter(
                    (_, idx) => (idx > to_after_this_col_idx) && (idx < from_col_idx)
                ).map(col => col.clone())
            );
            new_cols.push(
                this._cols.filter(
                    (_, idx) => (idx > from_col_idx)
                ).map(col => col.clone())
            );
            new_row._cols = new_cols;
        }

        return new_row;
    }
}

// Grid is just an array of rows
class ImmutableItemGrid {
    constructor({grid, num_cols} = {grid: [], num_cols: 0}) {
        this._grid = grid;
        this._num_cols = num_cols;

        this.clone = this.clone.bind(this);

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

    //
    // Clone the entire grid.
    clone() {
        return new ImmutableItemGrid({
            grid: this._grid.map(row => row.clone()),
            num_cols: this._num_cols
        });
    }

    //
    // Returns a clone of the grid with a new, empty row added between `after_this_row_idx` and
    // `after_this_row_idx + 1`.
    add_row(after_this_row_idx) {
        if ((after_this_row_idx < 0) || (after_this_row_idx >= this._array.length)) {
            throw new Error(
                `Cannot insert row after ${after_this_row_idx} as there ` +
                `are only ${this._array.length} rows`
            );
        }

        let new_grid = this._grid.filter(
            (row, idx) => idx <= after_this_row_idx
        ).map(row => row.clone());
        new_grid.push(new ImmutabeRow(this._num_cols))
        new_grid.push(
            this._grid.filter(
                 (_ , idx) => idx > after_this_row_idx
            ).map(
                row => row.clone()
            )
        );

        return new ImmutableItemGrid({grid: new_grid, num_cols: this._num_cols});
    }

    //
    // Returns a clone of the grid with the row at `row_idx` deleted.
    delete_row(row_idx) {
        if ((row_idx < 0) || (row_idx >= this._array.length)) {
            throw new Error(
                `Cannot delete row ${row_idx} as there are only ${this._array.length} rows`
            );
        }

        const new_grid = this._grid.filter((row, idx) => idx !== row_idx).map(row => row.clone());
        return new ImmutableItemGrid({grid: new_grid, num_cols: this._num_cols});
    }

    //
    // Returns a clone of the grid with the row identified by `from_idx` moved to the row index
    // immediately after `after_to_idx`, moving the rows after this down by one.
    move_row({from_idx, after_to_idx}) {
        if (from_idx === after_to_idx) {
            throw new Error("Cannot move row to same row");
        }
        else if ((from_idx < 0) | (from_idx >= this._grid.length)) {
            throw new Error(`Cannot move row from ${from_idx}: out of bounds`);
        }
        else if ((after_to_idx < 0) | (after_to_idx >= this._grid.length)) {
            throw new Error(`Cannot move row to row after ${after_to_idx}: out of bounds`);
        }

        const from_clone = this._grid[from_idx].clone();
        const [first_idx, second_idx] =
            (from_idx < after_to_idx) ? [from_idx, after_to_idx] : [after_to_idx, from_idx];

        let new_grid = null;
        if (from_idx < after_to_idx) {
            // Copy & clone up to from_idx.
            new_grid = this._grid = this._grid.filter(
                (_, idx) => idx < first_idx
            ).map(row => row.clone())

            // Move all the rows below from_idx up onw up until and including after_to_idx
            new_grid.push(
                this._grid.filter(
                    (row, idx) => ((idx > from_idx) && (idx <= after_to_idx))
                ).map(row => row.clone())
            );

            // Insert the from_clone
            new_grid.push(from_clone);

            // Add the remaining rows back in
            new_grid.push(
                this._grid.filter(
                    (row, idx) => (idx > after_to_idx)
                ).map(row => row.clone())
            );
        }
        else {
            // Copy & clone up to and including after_to_idx.
            new_grid = this._grid = this._grid.filter(
                (_, idx) => idx <= after_to_idx
            ).map(row => row.clone())

            // Insert the from_clone
            new_grid.push(from_clone);

            // Copy & clone everything else, except from_idx
            new_grid.push(
                this._grid.filter(
                    (row, idx) => (idx > after_to_idx) && (idx != from_idx)
                ).map(row => row.clone())
            );
        }

        return new ImmutableItemGrid({grid: new_grid, num_cols: this._num_cols});
    }

    //
    // Add a column just after after_this_col_idx by adding a column to every row.
    add_col(after_this_col_idx) {
        const new_grid  = this._grid.map(row => row.add_col(after_this_col_idx));
        return new ImmutableItemGrid({grid: new_grid, num_cols: this._num_cols + 1});
    }

    //
    // Deletes a column by deleting the column from every row.
    delete_col(col_idx) {
        const new_grid  = this._grid.map(row => row.delete_col(after_this_col_idx));
        return new ImmutableItemGrid({grid: new_grid, num_cols: this._num_cols - 1});
    }

    //
    // Move a column by moving it in every row to the column just after to_after_this_col_idx
    move_col(from_col_idx, to_after_this_col_idx) {
        const new_grid  = this._grid.map(row => row.move_col(from_col_idx, to_after_this_col_idx));
        return new ImmutableItemGrid({grid: new_grid, num_cols: this._num_cols});
    }

    //
    // Add an item to a specific row/col. If after_this_item_idx is -1 then it is appended,
    // otherwise it is added just after that index.
    add_item(row_idx, col_idx, after_this_item_idx, new_item) {
    }

    //
    // Delete an item from a specific row/col.
    delete_item(row_idx, col_idx, item_idx) {
    }

    // Move an item from one location to another.
    move_item(
        from_row_idx, from_col_idx, from_item_idx,
        to_after_row_idx, to_after_col_idx, to_after_item_idx
    ) {
        
    }
}
