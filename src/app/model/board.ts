import {BoardElement} from "./boardElement";

export class Board {
    readonly width: number;
    readonly height: number;

    boardElements: Array<BoardElement>;

    constructor(boardElements: Array<BoardElement>) {
        this.width = 32;
        this.height = 32;

        this.boardElements = boardElements;
    }

    removeDestroyedObjects(): void {
        this.boardElements = this.boardElements.filter(boardEl => !boardEl.isDestroyed())
    }
}
