import {BoardElementsFactory} from "./boardElements.factory";
import {Tank, TankType} from "../model/tank";
import {Board} from "../model/board";
import tanksResponse from "../api/tanks.json";
import {SpriteService} from "./sprite.service";

export class TankManagerService {
    private totalAmount;
    private maxAmount = 10;

    private boardElementFactory: BoardElementsFactory;
    private spriteService: SpriteService;
    private board: Board;

    constructor(board: Board, boardElementFactory: BoardElementsFactory, spriteService: SpriteService) {
        this.board = board;
        this.boardElementFactory = boardElementFactory;
        this.spriteService = spriteService;
    }

    initializeTanks() {
        this.createTank(tanksResponse.player.x, tanksResponse.player.y, TankType.PLAYER);
        tanksResponse.enemies.forEach(enemy => this.createTank(enemy.x, enemy.y, TankType.ENEMY));
        this.totalAmount = tanksResponse.enemies.length;
    }

    replaceTank(tank: Tank): Tank | null {
        this.board.removeTank(tank);
        this.spriteService.removeSprites(tank.boardSprite, tank.getBullet().boardSprite);

        if (this.totalAmount < this.maxAmount) {
            this.totalAmount++;
            const newTank = this.boardElementFactory.createTank(tank.startX, tank.startY, TankType.ENEMY);
            this.board.addTankToBoard(newTank);
            return newTank;
        }
        return null;
    }

    private createTank(x: number, y: number, tankType: TankType) {
        const tank = this.boardElementFactory.createTank(x, y, tankType);
        this.board.addTankToBoard(tank);
    }
}