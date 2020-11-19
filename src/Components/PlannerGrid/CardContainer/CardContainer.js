import React from 'react';
import Classes from './CardContainer.module.css';

const cardContainer = (props) => (
  <div className={Classes.cardContainer}>
    {props.children}
  </div>
);

export default cardContainer;