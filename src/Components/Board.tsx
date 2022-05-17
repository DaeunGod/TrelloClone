import React, { useState } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { ITodo, toDoState, IToDoState } from "../atoms";
import DraggableCard from "./DraggableCard";

const Wrapper = styled.div`
  padding-top: 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 200px;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  box-shadow: 5px 5px 3px rgba(0, 0, 0, 0.5);
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
`;

const Title = styled.h2`
  /* text-align: center; */
  /* font-size: 18px;
  font-weight: 600; */
`;

const TitleEdit = styled.input``;

const TitleSpace = styled.div`
  width: 20%;
  display: flex;
  justify-content: space-evenly;
`;

const TitleButton = styled.span`
  text-align: center;
  width: 20px;
  height: 20px;
  border: 1px solid black;
  font-size: 18px;
  border-radius: 5px;
  background-color: white;
  cursor: pointer;
  &:hover {
    background-color: #feca57;
  }
`;

const Area = styled.div<{
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#dfe6e9"
      : props.isDraggingFromThis
      ? "#b2bec3"
      : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
`;

const Input = styled.input`
  background-color: transparent;
  border: 1px solid black;
  width: 80%;
  border-radius: 15px;
  text-align: center;
  background-color: white;
  &:focus {
    background-color: #feca57;
  }
`;

const AddButton = styled.span`
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

interface BoardProp {
  toDos: ITodo[];
  boardId: string;
}

interface IForm {
  toDo: string;
  title: string;
}

const Board = ({ toDos, boardId }: BoardProp) => {
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const setTodos = useSetRecoilState(toDoState);
  const [editTitle, setEditTitle] = useState(false);

  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setTodos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [newToDo, ...allBoards[boardId]],
      };
    });
    setValue("toDo", "");
  };

  const onRemoveToDo = (targetToDoId: number) => {
    setTodos((allBoards) => {
      const copy = [...allBoards[boardId]];
      return {
        ...allBoards,
        [boardId]: copy.filter((toDo) => toDo.id !== targetToDoId),
      };
    });
  };

  const onRemoveBoard = () => {
    setTodos((oldBoard) => {
      const newBoard: IToDoState = {};
      Object.assign(newBoard, oldBoard);
      delete newBoard[boardId];
      return newBoard;
    });
  };

  const inputHandler = handleSubmit(onValid);

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    setValue: setValue2,
  } = useForm<IForm>();
  setValue2("title", boardId);

  const onTitleValid = ({ title }: IForm) => {
    setTodos((oldBoard) => {
      const copy = oldBoard[boardId];

      const newBoard: IToDoState = {};
      Object.assign(newBoard, oldBoard);
      delete newBoard[boardId];
      newBoard[title] = copy;
      return newBoard;
    });

    setValue2("title", "");
    setEditTitle(false);
  };

  const titleInputHandler = handleSubmit2(onTitleValid);

  const onEditTitleClicked = () => {
    if (editTitle) {
      titleInputHandler();
    }
    setEditTitle((prev) => !prev);
  };

  return (
    <Wrapper>
      <TitleWrapper>
        <TitleSpace />
        {editTitle ? (
          <form onSubmit={titleInputHandler}>
            <TitleEdit
              {...register2("title", { required: true })}
              type="text"
              placeholder={`${boardId.toLocaleUpperCase()}`}
            />
          </form>
        ) : (
          <Title>{boardId.toLocaleUpperCase()}</Title>
        )}
        <TitleSpace>
          <TitleButton onClick={onEditTitleClicked}>
            {editTitle ? "💾" : "✏️"}
          </TitleButton>
          <TitleButton onClick={onRemoveBoard}>-</TitleButton>
        </TitleSpace>
      </TitleWrapper>
      <Form onSubmit={inputHandler}>
        <Input
          {...register("toDo", { required: true })}
          type="text"
          placeholder={`add task on ${boardId.toLocaleUpperCase()}`}
        />
        <AddButton onClick={inputHandler}>+</AddButton>
      </Form>
      <Droppable droppableId={boardId}>
        {(magic, snapshot) => (
          <Area
            isDraggingOver={snapshot.isDraggingOver}
            isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DraggableCard
                key={toDo.id}
                index={index}
                toDoId={toDo.id}
                toDoText={toDo.text}
                onRemoveToDo={onRemoveToDo}
              />
            ))}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
};

export default Board;
