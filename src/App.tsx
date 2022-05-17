import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState, newBoardIdState } from "./atoms";
import Board from "./Components/Board";

const Wrapper = styled.div`
  /* max-width: 850px; */
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div<{ length: number }>`
  display: grid;
  width: ${(props) => (props.length * 30 > 100 ? 100 : props.length * 30)}%;
  gap: 10px;
  /* grid-template-columns: repeat(3, 1fr); */
`;

const AddButton = styled.div`
  background-color: white;
  width: 80px;
  height: 80px;
  margin-left: 10px;
  border: 2px dashed black;
  text-align: center;
  font-size: 65px;
  background-color: transparent;
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.boardColor};
  }
`;

const App = () => {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const [newBoardId, setNewBoardId] = useRecoilState(newBoardIdState);

  const onDragEnd = ({ draggableId, destination, source }: DropResult) => {
    if (!destination) return;
    if (destination.droppableId === source.droppableId) {
      setToDos((oldBoard) => {
        const copy = [...oldBoard[source.droppableId]];
        const task = copy[source.index];
        copy.splice(source.index, 1);
        copy.splice(destination.index, 0, task);
        return {
          ...oldBoard,
          [source.droppableId]: copy,
        };
      });
    }

    if (destination.droppableId !== source.droppableId) {
      setToDos((allBoards) => {
        const sources = [...allBoards[source.droppableId]];
        const task = sources[source.index];
        const targets = [...allBoards[destination.droppableId]];

        sources.splice(source.index, 1);
        targets.splice(destination.index, 0, task);

        return {
          ...allBoards,
          [source.droppableId]: sources,
          [destination.droppableId]: targets,
        };
      });
    }
  };

  const onAddToDo = () => {
    if (Object.keys(toDos).length > 4) return;

    setToDos((oldBoard) => {
      const newBoardName = "NewBoard" + newBoardId;
      return {
        ...oldBoard,
        [newBoardName]: [],
      };
    });
    setNewBoardId((prev) => prev + 1);
  };

  const length = Object.keys(toDos).length;
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards
          length={length}
          style={{ gridTemplateColumns: `repeat(${length}, 1fr)` }}
        >
          {Object.keys(toDos).map((boardId) => (
            <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
          ))}
        </Boards>
        <AddButton onClick={onAddToDo}>+</AddButton>
      </Wrapper>
    </DragDropContext>
  );
};

export default App;
