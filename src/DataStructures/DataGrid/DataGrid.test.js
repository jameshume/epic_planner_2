import { ImmutableItemGrid, ImmutableItem } from './DataGrid';

test('New immutable data grid is empty', () => {
  let dg = new ImmutableItemGrid();
  expect(dg._grid).toEqual([]);
  expect(dg._grid.length).toEqual(0);
  expect(dg._num_cols).toEqual(0);
});

// The the best written test and not exhaustive but meh!
test("'Add and move columns" , () => {
  let dg = new ImmutableItemGrid();

  // Add the first row. It will have zero columns.
  dg = dg.add_row(0);
  // DG = [ ]
  expect(dg._grid.length).toEqual(1);
  expect(dg._grid[0].length).toEqual(0);

  // Add a column. The only row should get the column added.
  dg = dg.add_col(0);
  // DG = [ [] ]
  expect(dg._grid.length).toEqual(1);
  expect(dg._grid[0].length).toEqual(1);
  expect(dg._num_cols).toEqual(1);

  // Add an item so that we can verify that rows move correctly
  dg = dg.add_item(0, 0, 0, new ImmutableItem({title: "T1", description: "D1", story_points: 11}))
  // DG = [ [[I1]] ]
  expect(dg._grid.length).toEqual(1);
  expect(dg._grid[0].length).toEqual(1);
  expect(dg._num_cols).toEqual(1);
  expect(dg._grid[0][0].length).toEqual(1);
  expect(dg._grid[0][0][0]._title).toEqual("T1");
  expect(dg._grid[0][0][0]._description).toEqual("D1");
  expect(dg._grid[0][0][0]._story_points).toEqual(11);

  // Add a column at the start
  dg = dg.add_col(0);
  // DG = [ [], [[I1]] ]
  expect(dg._grid.length).toEqual(1);
  expect(dg._grid[0].length).toEqual(2);
  expect(dg._num_cols).toEqual(2);
  expect(dg._grid[0][0].length).toEqual(0);
  expect(dg._grid[0][1].length).toEqual(1);
  expect(dg._grid[0][1][0]._title).toEqual("T1");
  expect(dg._grid[0][1][0]._description).toEqual("D1");
  expect(dg._grid[0][1][0]._story_points).toEqual(11);

  // Add a column at the end
  dg = dg.add_col(2);
  // DG = [ [], [[I1]], [] ]
  expect(dg._grid.length).toEqual(1);
  expect(dg._grid[0].length).toEqual(3);
  expect(dg._num_cols).toEqual(3);
  expect(dg._grid[0][0].length).toEqual(0);
  expect(dg._grid[0][1].length).toEqual(1);
  expect(dg._grid[0][1][0]._title).toEqual("T1");
  expect(dg._grid[0][1][0]._description).toEqual("D1");
  expect(dg._grid[0][1][0]._story_points).toEqual(11);
  expect(dg._grid[0][2].length).toEqual(0);

  // Add an item to the first column so moving columns can be tested
  dg = dg.add_item(0, 0, 0, new ImmutableItem({title: "T2", description: "D2", story_points: 22}));
  // DG = [ [[I2]], [[I1]], [] ]
  expect(dg._grid.length).toEqual(1);
  expect(dg._grid[0].length).toEqual(3);
  expect(dg._num_cols).toEqual(3);
  expect(dg._grid[0][0].length).toEqual(1);
  expect(dg._grid[0][0][0]._title).toEqual("T2");
  expect(dg._grid[0][0][0]._description).toEqual("D2");
  expect(dg._grid[0][0][0]._story_points).toEqual(22);
  expect(dg._grid[0][1].length).toEqual(1);
  expect(dg._grid[0][1][0]._title).toEqual("T1");
  expect(dg._grid[0][1][0]._description).toEqual("D1");
  expect(dg._grid[0][1][0]._story_points).toEqual(11);
  expect(dg._grid[0][2].length).toEqual(0);

  // Move column 0 to position 2
  dg = dg.move_col(0,2);
  // DG = [ [[I1]], [[I2]], [] ]
  expect(dg._grid[0][0].length).toEqual(1);
  expect(dg._grid[0][0][0]._title).toEqual("T1");
  expect(dg._grid[0][0][0]._description).toEqual("D1");
  expect(dg._grid[0][0][0]._story_points).toEqual(11);
  expect(dg._grid[0][1].length).toEqual(1);
  expect(dg._grid[0][1][0]._title).toEqual("T2");
  expect(dg._grid[0][1][0]._description).toEqual("D2");
  expect(dg._grid[0][1][0]._story_points).toEqual(22);
  expect(dg._grid[0][2].length).toEqual(0);

  // Move column 1 to position 3
  dg = dg.move_col(1,3);
  // DG = [ [[I1]], [], [[I2]] ]
  expect(dg._grid[0][0].length).toEqual(1);
  expect(dg._grid[0][0][0]._title).toEqual("T1");
  expect(dg._grid[0][0][0]._description).toEqual("D1");
  expect(dg._grid[0][0][0]._story_points).toEqual(11);
  expect(dg._grid[0][1].length).toEqual(0);
  expect(dg._grid[0][2].length).toEqual(1);
  expect(dg._grid[0][2][0]._title).toEqual("T2");
  expect(dg._grid[0][2][0]._description).toEqual("D2");
  expect(dg._grid[0][2][0]._story_points).toEqual(22);

  // Now try the same with more than one row!
  dg = dg.add_row(1);
  // DG = [ [[I1]], [], [[I2]],
  //        [    ], [], [   ]
  //      ]
  dg = dg.add_item(1, 0, 0, new ImmutableItem({title: "T3", description: "D3", story_points: 33}));
  dg = dg.add_item(1, 1, 0, new ImmutableItem({title: "T4", description: "D4", story_points: 44}));
  dg = dg.add_item(1, 2, 0, new ImmutableItem({title: "T5", description: "D5", story_points: 55}));
  // DG = [ [[I1]], [    ], [[I2]],
  //        [[I3]], [[I4]], [[I5]]
  //      ]
  expect(dg._grid[0][0].length).toEqual(1);
  expect(dg._grid[0][0][0]._title).toEqual("T1");
  expect(dg._grid[0][0][0]._description).toEqual("D1");
  expect(dg._grid[0][0][0]._story_points).toEqual(11);
  expect(dg._grid[0][1].length).toEqual(0);
  expect(dg._grid[0][2].length).toEqual(1);
  expect(dg._grid[0][2][0]._title).toEqual("T2");
  expect(dg._grid[0][2][0]._description).toEqual("D2");
  expect(dg._grid[0][2][0]._story_points).toEqual(22);
  expect(dg._grid[1][0].length).toEqual(1);
  expect(dg._grid[1][0][0]._title).toEqual("T3");
  expect(dg._grid[1][0][0]._description).toEqual("D3");
  expect(dg._grid[1][0][0]._story_points).toEqual(33);
  expect(dg._grid[1][1].length).toEqual(1);
  expect(dg._grid[1][1][0]._title).toEqual("T4");
  expect(dg._grid[1][1][0]._description).toEqual("D4");
  expect(dg._grid[1][1][0]._story_points).toEqual(44);
  expect(dg._grid[1][2].length).toEqual(1);
  expect(dg._grid[1][2][0]._title).toEqual("T5");
  expect(dg._grid[1][2][0]._description).toEqual("D5");
  expect(dg._grid[1][2][0]._story_points).toEqual(55);

  // Move column 2 to position 0
  dg = dg.move_col(2,0);
  // DG = [ [[I2]], [[I1]], [    ],
  //        [[I5]], [[I3]], [[I4]]
  //      ]
  expect(dg._grid[0][0].length).toEqual(1);
  expect(dg._grid[0][0][0]._title).toEqual("T2");
  expect(dg._grid[0][0][0]._description).toEqual("D2");
  expect(dg._grid[0][0][0]._story_points).toEqual(22);
  expect(dg._grid[0][1].length).toEqual(1);
  expect(dg._grid[0][1][0]._title).toEqual("T1");
  expect(dg._grid[0][1][0]._description).toEqual("D1");
  expect(dg._grid[0][1][0]._story_points).toEqual(11);
  expect(dg._grid[0][2].length).toEqual(0);
  expect(dg._grid[1][0].length).toEqual(1);
  expect(dg._grid[1][0][0]._title).toEqual("T5");
  expect(dg._grid[1][0][0]._description).toEqual("D5");
  expect(dg._grid[1][0][0]._story_points).toEqual(55);
  expect(dg._grid[1][1].length).toEqual(1);
  expect(dg._grid[1][1][0]._title).toEqual("T3");
  expect(dg._grid[1][1][0]._description).toEqual("D3");
  expect(dg._grid[1][1][0]._story_points).toEqual(33);
  expect(dg._grid[1][2].length).toEqual(1);
  expect(dg._grid[1][2][0]._title).toEqual("T4");
  expect(dg._grid[1][2][0]._description).toEqual("D4");
  expect(dg._grid[1][2][0]._story_points).toEqual(44);

  // Lets try and move a row - this is basically a swap!
  dg = dg.move_row(0,2);
  // DG = [ [[I5]], [[I3]], [[I4]],
  //        [[I2]], [[I1]], [    ]
  //      ]
  expect(dg._grid[0][0].length).toEqual(1);
  expect(dg._grid[0][0][0]._title).toEqual("T5");
  expect(dg._grid[0][0][0]._description).toEqual("D5");
  expect(dg._grid[0][0][0]._story_points).toEqual(55);
  expect(dg._grid[0][1].length).toEqual(1);
  expect(dg._grid[0][1][0]._title).toEqual("T3");
  expect(dg._grid[0][1][0]._description).toEqual("D3");
  expect(dg._grid[0][1][0]._story_points).toEqual(33);
  expect(dg._grid[0][2].length).toEqual(1);
  expect(dg._grid[0][2][0]._title).toEqual("T4");
  expect(dg._grid[0][2][0]._description).toEqual("D4");
  expect(dg._grid[0][2][0]._story_points).toEqual(44);
  expect(dg._grid[1][0].length).toEqual(1);
  expect(dg._grid[1][0][0]._title).toEqual("T2");
  expect(dg._grid[1][0][0]._description).toEqual("D2");
  expect(dg._grid[1][0][0]._story_points).toEqual(22);
  expect(dg._grid[1][1].length).toEqual(1);
  expect(dg._grid[1][1][0]._title).toEqual("T1");
  expect(dg._grid[1][1][0]._description).toEqual("D1");
  expect(dg._grid[1][1][0]._story_points).toEqual(11);
  expect(dg._grid[1][2].length).toEqual(0);

  // Try appending some items
  dg = dg.append_item(1,2, new ImmutableItem({title: "T6", description: "D6", story_points: 66}));
  // DG = [ [[I5]], [[I3]], [[I4]],
  //        [[I2]], [[I1]], [[I6]]
  //      ]
  expect(dg._grid[1][2].length).toEqual(1);
  expect(dg._grid[1][2][0]._title).toEqual("T6");
  expect(dg._grid[1][2][0]._description).toEqual("D6");
  expect(dg._grid[1][2][0]._story_points).toEqual(66);

  dg = dg.append_item(1,2, new ImmutableItem({title: "T7", description: "D7", story_points: 77}));
  // DG = [ [[I5]], [[I3]], [[I4]],
  //        [[I2]], [[I1]], [[I6,I7]]
  //      ]
  expect(dg._grid[1][2].length).toEqual(2);
  expect(dg._grid[1][2][0]._title).toEqual("T6");
  expect(dg._grid[1][2][0]._description).toEqual("D6");
  expect(dg._grid[1][2][0]._story_points).toEqual(66);
  expect(dg._grid[1][2][1]._title).toEqual("T7");
  expect(dg._grid[1][2][1]._description).toEqual("D7");
  expect(dg._grid[1][2][1]._story_points).toEqual(77);

  dg = dg.add_item(1,2,1, new ImmutableItem({title: "T8", description: "D8", story_points: 88}));
  // DG = [ [[I5]], [[I3]], [[I4]],
  //        [[I2]], [[I1]], [[I6,I8,I7]]
  //      ]
  expect(dg._grid[1][2].length).toEqual(3);
  expect(dg._grid[1][2][0]._title).toEqual("T6");
  expect(dg._grid[1][2][0]._description).toEqual("D6");
  expect(dg._grid[1][2][0]._story_points).toEqual(66);
  expect(dg._grid[1][2][1]._title).toEqual("T8");
  expect(dg._grid[1][2][1]._description).toEqual("D8");
  expect(dg._grid[1][2][1]._story_points).toEqual(88);
  expect(dg._grid[1][2][2]._title).toEqual("T7");
  expect(dg._grid[1][2][2]._description).toEqual("D7");
  expect(dg._grid[1][2][2]._story_points).toEqual(77);


  dg = dg.add_item(0,0,0, new ImmutableItem({title: "T9", description: "D9", story_points: 99}));
  // DG = [ [[I9,I5]], [[I3]], [[I4]],
  //        [[I2   ]], [[I1]], [[I6,I8,I7]]
  //      ]
  expect(dg._grid[0][0].length).toEqual(2);
  expect(dg._grid[0][0][0]._title).toEqual("T9");
  expect(dg._grid[0][0][0]._description).toEqual("D9");
  expect(dg._grid[0][0][0]._story_points).toEqual(99);
  expect(dg._grid[0][0][1]._title).toEqual("T5");
  expect(dg._grid[0][0][1]._description).toEqual("D5");
  expect(dg._grid[0][0][1]._story_points).toEqual(55);

  // Try moving some items
  dg = dg.move_item(0, 0, 1, 0, 0, 0);
  // DG = [ [[I5,I9]], [[I3]], [[I4]],
  //        [[I2   ]], [[I1]], [[I6,I8,I7]]
  //      ]
  expect(dg._grid[0][0].length).toEqual(2);
  expect(dg._grid[0][0][0]._title).toEqual("T5");
  expect(dg._grid[0][0][0]._description).toEqual("D5");
  expect(dg._grid[0][0][0]._story_points).toEqual(55);
  expect(dg._grid[0][0][1]._title).toEqual("T9");
  expect(dg._grid[0][0][1]._description).toEqual("D9");
  expect(dg._grid[0][0][1]._story_points).toEqual(99);

  dg = dg.move_item(0, 0, 0, 0, 0, 1);
  // DG = [ [[I9,I5]], [[I3]], [[I4]],
  //        [[I2   ]], [[I1]], [[I6,I8,I7]]
  //      ]
  expect(dg._grid[0][0].length).toEqual(2);
  expect(dg._grid[0][0][0]._title).toEqual("T9");
  expect(dg._grid[0][0][0]._description).toEqual("D9");
  expect(dg._grid[0][0][0]._story_points).toEqual(99);
  expect(dg._grid[0][0][1]._title).toEqual("T5");
  expect(dg._grid[0][0][1]._description).toEqual("D5");
  expect(dg._grid[0][0][1]._story_points).toEqual(55);

  // And between row/cols
  dg = dg.move_item(0, 0, 0, 1, 0, 0);
  // DG = [ [[I5    ]], [[I3]], [[I4]],
  //        [[I9, I2]], [[I1]], [[I6,I8,I7]]
  //      ]
  expect(dg._grid[0][0].length).toEqual(1);
  expect(dg._grid[0][0][0]._title).toEqual("T5");
  expect(dg._grid[0][0][0]._description).toEqual("D5");
  expect(dg._grid[0][0][0]._story_points).toEqual(55);

  expect(dg._grid[1][0].length).toEqual(2);
  expect(dg._grid[1][0][0]._title).toEqual("T9");
  expect(dg._grid[1][0][0]._description).toEqual("D9");
  expect(dg._grid[1][0][0]._story_points).toEqual(99);

  // Lets try out the col view
  let cv = dg.col_view(1)
  // This should give me an array: [ [I3], [I1] ]
  expect(cv[0].length).toEqual(1);
  expect(cv[0][0]._title).toEqual("T3");
  expect(cv[1].length).toEqual(1);
  expect(cv[1][0]._title).toEqual("T1");

  cv = dg.col_view(0)
  // This should give me an array: [ [I5], [I9, I2] ]
  expect(cv[0].length).toEqual(1);
  expect(cv[0][0]._title).toEqual("T5");
  expect(cv[1].length).toEqual(2);
  expect(cv[1][0]._title).toEqual("T9");
  expect(cv[1][1]._title).toEqual("T2");
});