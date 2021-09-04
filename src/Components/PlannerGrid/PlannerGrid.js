import React from 'react';

// Redux related imports
import { connect } from 'react-redux';

// Styles
import Classes from './PlannerGrid.module.css';
import CommonClasses from '../../Common/Common.module.css';

// Component dependencies
import Card from './Card/Card';
import CardPlaceholder from './Card/CardPlaceholder';
import CardContainer from './CardContainer/CardContainer';
import ColumnHeader from './ColumnHeader/ColumnHeader';
import RowHeader from './RowHeader/RowHeader';

class plannerGrid extends React.Component {
    render() {
        let grid_divs = [];

        //
        // The HTML grid is just a collection of <div>'s that are laid out one after the other,
        // filling the grid up row by row. No CSS properties are used to position a <div> at a
        // specific row column... enough are laid out in sequence to fill up the grid correctly
        // without needing to do this. At the end of each row is a dummy cell that will expand to
        // take up the remaining space so that the rest of the cells will auto-fit their width.
        //
        // The grid looks like:
        //    <space>    <cheader>         <cheader>        ... <space>
        //    <rheader>  <card container>  <card container> ... <space>
        //    ...
        //    <rheader>  <card container>  <card container> ... <space>
        //
        // Where the <card container> contains a set of <cards>/
        //
        for (let [row_idx, row] of this.props.grid._grid.entries()) {
            let row_cols = [];
            for (let [col_idx, col] of row.entries()) {
                let row_col_items = [];
                for (let [item_idx] of col.entries()) {
                    row_col_items.push(
                        <Card
                            key={`${row_idx}_${col_idx}_${item_idx}`} // WARNING/FIXME: Crap key!
                            itemId={[row_idx, col_idx, item_idx]}
                        />
                    );
                }
                if ((row_idx > 0) && (col_idx > 0)) {
                    // All items not in the first row and first column are cards. Each (row,col) is
                    // a collection of many cards
                    if (row_col_items.length === 0) {
                        row_col_items.push(
                            <CardPlaceholder
                                key={`${row_idx}_${col_idx}_0`} // WARNING/FIXME: Crap key!
                                itemId={[row_idx, col_idx, 0]}
                            />
                        );
                    }
                    row_cols.push(
                        <CardContainer
                            key={`${row_idx}_${col_idx}`}
                        >
                            {row_col_items}
                        </CardContainer>
                    );
                }
                else {
                    // All items in the first row and first column are headers. Each (row,col) must
                    // only be one special header card or spacer for position (0,0).
                    if ((row_idx === 0) && (col_idx === 0)) {
                        row_cols.push(<div key="s0_0" style={{width:"1px", height:"1px"}}/>);
                    }
                    else {
                        if (row_idx === 0) {
                            // First row contains the column headers
                            row_cols.push(
                                <ColumnHeader
                                    key={`ch_${col_idx}`}
                                    column_id={col_idx}
                                />
                            );
                        }
                        else if (col_idx === 0) {
                            // First column contains the row headers
                            row_cols.push(
                                <RowHeader
                                    key={`rh_${row_idx}`}
                                    row_id={row_idx}
                                />
                            );
                        }
                        else {
                            throw new Error("Logic error - shouuld not be possible!");
                        }
                    }
                }
            }
            // The last element in each row is a dummy spacer element
            row_cols.push(<div key={`e_${row_idx}`} style={{width:"1px", height:"1px"}}/>)
            grid_divs.push(row_cols);
        }

        return (
            <div
                className={[CommonClasses.scrollable, Classes.grid].join(" ")}
                style={{
                    gridTemplateRows: `repeat(${this.props.grid.get_num_rows()}, auto) 1fr`,
                    gridTemplateColumns: `repeat(${this.props.grid.get_num_cols()}, auto) 1fr`,
                }}
            >
                {grid_divs}
            </div>
        );
    }
}

// How state, managed by redux, should be mapped to props that can be accessed in this component
// The state parameter is the state as setup in reducer.js so it will have those properties.
const mapStateToProps = state => { // Func that expects the state, stored in redux and returns a map
    return {
        grid: state.epicPlanner.grid
    };
}

export default connect(mapStateToProps, null)(plannerGrid);
