import BoxedArrowIcon from '../../Icons/BoxedArrowIcon';
import Classes from './ArrowGrid.module.css';

const arrowDiv = (props) => (
  <div className={Classes.ArrowGrid}>
    <BoxedArrowIcon
      className={Classes.r1c2}arrowDirection={BoxedArrowIcon.DIR.UP}
      onClick={() => props.onArrowClick("up")}
    />
    <BoxedArrowIcon
      className={Classes.r2c3}arrowDirection={BoxedArrowIcon.DIR.RIGHT}
      onClick={() => props.onArrowClick("right")}
    />
    <BoxedArrowIcon
      className={Classes.r2c1}arrowDirection={BoxedArrowIcon.DIR.LEFT}
      onClick={() => props.onArrowClick("left")}
    />
    <BoxedArrowIcon
      className={Classes.r3c2}arrowDirection={BoxedArrowIcon.DIR.DOWN}
      onClick={() => props.onArrowClick("down")}
    />
    <div></div>
  </div>
);

export default arrowDiv;
