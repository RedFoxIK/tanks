import {BoardElementsFactory} from "./boardElements.factory";
import {Tank, TankType} from "../model/tank";
import {Board} from "../model/board";

export class TankManagerService {
    private initialTankAmount = 3;
    private maxAmount = 10;
    private totalAmount;

    private boardElemsFactory: BoardElementsFactory;
    private board: Board;

    constructor(board: Board, boardElemsFactory: BoardElementsFactory) {
        this.board = board;
        this.boardElemsFactory = boardElemsFactory;

        this.totalAmount = this.initialTankAmount;
    }

    replaceTank(tank: Tank) {
        if (this.totalAmount < this.maxAmount) {
            return this.boardElemsFactory.createTank(tank.startX, tank.startY, TankType.ENEMY);
        }
    }
}