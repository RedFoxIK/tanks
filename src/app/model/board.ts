import {BoardElement} from "./boardElement";
import {Tank, TankType} from "./tank";

export class Board {
    static BOARD_SIZE = 32;

    private boardElements: BoardElement | null [][];
    private playerTank: Tank;
    private othersTanks: Tank[] = [];
    private allTanks: Tank[] = [];

    constructor() {
        this.boardInitialize();
    }

    addTankToBoard(tank: Tank) {
        if (tank.tankType == TankType.PLAYER) {
            this.playerTank = tank;
        } else {
            this.othersTanks.push(tank);
        }
        this.allTanks.push(tank);
    }

    addBoardElemToBoard(elem: BoardElement, x: number, y: number) {
        this.boardElements[x][y] = elem;
    }

    getBoardElemToBoard(x: number, y: number): BoardElement {
        return this.boardElements[x][y];
    }

    getPlayerTank(): Tank {
        return this.playerTank;
    }

    getOthersTanks(): Tank[] {
        return this.othersTanks;
    }

    getAllTanks(): Tank[] {
        return this.allTanks;
    }

    removeElem(x: number, y: number) {
        this.boardElements[x][y] = null;
    }

    private boardInitialize() {
        this.boardElements = [];
        for (let i = 0; i < 32; i++) {
            this.boardElements[i] = [];
            for (let j = 0; j < 32; j++) {
                this.boardElements[i][j] = null;
            }
        }
    }
}
