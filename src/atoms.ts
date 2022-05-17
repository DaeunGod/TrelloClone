import { atom, AtomEffect, selector } from "recoil";

export interface ITodo {
  id: number;
  text: string;
}

export interface IToDoState {
  [key: string]: ITodo[];
}

export interface INewBoardId {
  boardId: number;
}

const localStorageEffect: <T>(key: string) => AtomEffect<T> =
  (key: string) =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export const toDoState = atom<IToDoState>({
  key: "todo",
  default: {
    // TO_DO: [],
    // doing: [],
    // done: [],
  },
  effects: [localStorageEffect<IToDoState>("local_todos")],
});

export const newBoardIdState = atom({
  key: "newBoardId",
  default: 1,
  effects: [localStorageEffect<number>("local_board_id")],
});
