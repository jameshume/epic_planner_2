import React from 'react';

// Redux related imports
import { connect } from 'react-redux';
import * as actionTypes from '../../Store/Actions/EpicPlannerActions';

import Classes from './PlannerSideBar.module.css';
import ArrowGrid from './ArrowGrid/ArrowGrid.js';

const STORY_POINTS = Object.freeze(["unkown", "0.5", "1", "2", "3", "5", "8", "13", "21"]);

class plannerSideBar extends React.Component {
  render() {
    let display_fragment;

    if (this.props.selected_item !== null) {
      const selected_item = this.props.grid.get_item(...this.props.selected_item);

      let selected_story_point_value = "unkown";
      let story_point_options = STORY_POINTS.map(
        story_points_value => {
          const is_selected = (story_points_value === selected_item._story_points);
          if (is_selected) { selected_story_point_value = story_points_value; }
          return (
            <option
              value={story_points_value}
              key={story_points_value}
            >
              {story_points_value}
            </option>
          );
        }
      );

      display_fragment = (
        <React.Fragment>
          <h1>Properties</h1>
          <label>Title:</label>
          <textarea
            value={selected_item._title}
            onChange={
              (evt) => this.props.onSetItemTitle(this.props.selected_item, evt.target.value)
            }
          />

          <label>Description:</label>
          <textarea
            value={selected_item._description}
            onChange={
              (evt) => this.props.onSetItemDescription(this.props.selected_item, evt.target.value)
            }
          />

          <label>Story Points:</label>
          <select
            name="properties_storyPoints"
            id="properties_storyPoints"
            value={selected_story_point_value}
            onChange={
              (evt) => {
                this.props.onSetItemStoryPoints(this.props.selected_item, evt.target.value)
              }
            }
          >
            {story_point_options}
          </select>

          <h1>Move</h1>
          <ArrowGrid onArrowClick={(dir) => this.props.onMoveCard(this.props.selected_item, dir)}/>
          <p></p>

          <h1>Comments</h1>
          <p>Todo</p>

          <h1>History</h1>
          <p>Todo</p>
        </React.Fragment>
      );
    }
    else {
      display_fragment = (
        <React.Fragment>
          <h1>Properties</h1>
          <p>Select a card to view its properties...</p>
        </React.Fragment>
      );
    }

    return (
      <div className={Classes.plannerSideBar}>
        {display_fragment}
      </div>
    );
  }
}

// How state, managed by redux, should be mapped to props that can be accessed in this component
// The state parameter is the state as setup in reducedr.js so it will have those propertues.
const mapStateToProps = state => { // Func that expects the state, stored in redux and returns a map
  return {
      selected_item: state.epicPlanner.selected_item,
      grid: state.epicPlanner.grid,
  };
};

// Which actions the container will dispatch
const mapDispatchToProps = dispatch => {
  return {
    onSetItemTitle: (item_id, title) => dispatch(actionTypes.setItemTitle(item_id, title)),
    onSetItemDescription: (item_id, descr) => dispatch(actionTypes.setItemDescription(item_id, descr)),
    onSetItemStoryPoints: (item_id, sp) => dispatch(actionTypes.setItemStoryPoints(item_id, sp)),
    onMoveCard: (item_id, dir) => dispatch(actionTypes.moveCard(item_id, dir)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(plannerSideBar);
