import {BoardElement} from "./boardElement";
import {Tank, TankType} from "./tank";

export class Board {
    public static BOARD_SIZE = 32;

    private boardElements: BoardElement | null [][];
    private playerTank: Tank;
    private othersTanks: Tank[] = [];
    private allTanks: Tank[] = [];

    constructor() {
        this.boardInitialize();
    }

    public addTankToBoard(tank: Tank) {
        if (tank.tankType === TankType.PLAYER) {
            this.playerTank = tank;
        } else {
            this.othersTanks.push(tank);
        }
        this.allTanks.push(tank);
    }

    public addBoardElemToBoard(elem: BoardElement, x: number, y: number) {
        this.boardElements[x][y] = elem;
    }

    public getBoardElemToBoard(x: number, y: number): BoardElement | null {
        if (x < 0 || y < 0 || x >= Board.BOARD_SIZE || y >= Board.BOARD_SIZE) {
            return null;
        }
        return this.boardElements[Math.round(x)][Math.round(y)];
    }

    public getPlayerTank(): Tank {
        return this.playerTank;
    }

    public getOthersTanks(): Tank[] {
        return this.othersTanks;
    }

    public getAllTanks(): Tank[] {
        return this.allTanks;
    }

    public removeElem(x: number, y: number) {
        this.boardElements[x][y] = null;
    }

    public removeTank(tank: Tank) {
        this.allTanks = this.allTanks.filter((t) => t !== tank);
        this.othersTanks = this.othersTanks.filter((t) => t !== tank);
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
