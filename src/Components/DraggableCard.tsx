import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const Card = styled.div<{ isDragging: boolean }>`
  background-color: ${(props) =>
    props.isDragging ? "#74b9ff" : props.theme.cardColor};
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px 10px;
  width: 100%;
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0, 0, 0, 0.5)" : "none"};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RemoveButton = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  border: 1px solid black;
  font-size: 28px;
  text-align: center;

  background-color: ${(props) => props.theme.cardColor};
  cursor: pointer;
  &:hover {
    background-color: #feca57;
  }
`;

interface DraggableCardProp {
  toDoId: number;
  toDoText: string;
  index: number;
  onRemoveToDo: (targetToDoId: number) => void;
}

const DraggableCard = ({
  toDoId,
  toDoText,
  index,
  onRemoveToDo,
}: DraggableCardProp) => {
  return (
    <Draggable draggableId={toDoId + ""} index={index}>
      {(magic, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          {toDoText}
          <RemoveButton onClick={() => onRemoveToDo(toDoId)}>-</RemoveButton>
        </Card>
      )}
    </Draggable>
  );
};

export default React.memo(DraggableCard);
