import React from 'react';
import Classes from './Card.module.css';
import CardHeader from './CardHeader/CardHeader';
import CardBody from './CardBody/CardBody';

const card = (props) => (
    <div className={Classes.card}>
        <CardHeader
            storyPoints = {props.storyPoints}
            hasDescription = {props.hasDescription}
            importance = {props.importance}
            onDelete = {props.onDelete}
            onEdit = {props.onDelete}
            itemId = {props.itemId}
        ></CardHeader>
        <CardBody itemId = {props.itemId}/>
    </div>
);

export default card;