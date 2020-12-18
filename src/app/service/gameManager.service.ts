import {BoardElement, BoardObject, Eagle, Water} from "../model/boardElement";
import {AnimationAsset, SoundAsset, TankAsset} from "../model/asset";
import tanksResponse from "../api/tanks.json";
import {Tank, TankType} from "../model/tank";
import {Direction} from "../model/direction";
import {Game} from "../model/game";
import {SpriteService} from "./sprite.service";
import {BoardElementsFactory} from "./boardElements.factory";
import {Subject} from "rxjs";
import {BonusService} from "./bonus.service";

export class GameManagerService {
    readonly boardSize = 32;

    private spriteService: SpriteService;
    private boardElementFactory: BoardElementsFactory;
    private bonusService: BonusService;

    private game: Game;
    private board: BoardElement | null [][];
    private enemies: Tank[];
    playerTank: Tank;

    private takeLife$ = new Subject<Tank>();
    successGameOver$ = new Subject<boolean>();

    constructor(spriteService: SpriteService, game: Game) {
        this.game = game;
        this.spriteService = spriteService;
        this.boardElementFactory = new BoardElementsFactory(this.spriteService);
        this.enemies = [];
        this.boardInitialize();
        this.takeLife$.subscribe(tank => this.resolveTankSituation(tank));
        this.bonusService = new BonusService(this.spriteService, this.boardElementFactory);
    }

    //TODO: create model
    public generateBoard(boardModel: any) {
        for (let i = 0; i < 32; i++) {
            this.createBoardElem(0, i, BoardObject.BLOCK);
            this.createBoardElem(31, i, BoardObject.BLOCK);
            this.createBoardElem(i, 0, BoardObject.BLOCK);
            this.createBoardElem(i, 31, BoardObject.BLOCK);
        }

        Object.keys(boardModel).forEach(key => {
            boardModel[key].assets.forEach(asset => {
                this.createBoardElem(asset.x, asset.y, boardModel[key].boardElem, boardModel[key].type)
            });
        })

        this.createTank(TankAsset, TankAsset.TANK, tanksResponse.player.x, tanksResponse.player.y, TankType.PLAYER);
        tanksResponse.enemies.forEach(enemy => {
            this.createTank(TankAsset, TankAsset.ENEMY_TANK_1, enemy.x, enemy.y, TankType.ENEMY);
        })
        this.spriteService.rerenderScene();
        this.spriteService.playSound(SoundAsset.WIN_SOUND);
    }

    createTank(assetEnum, assetEnumValue: string, x: number, y: number, tankType: TankType) {
        const boardSprite = this.spriteService.createBoardElem(assetEnum, assetEnumValue, x, y, 1, true, true);
        const tank = new Tank(boardSprite, tankType);
        if (tankType == TankType.PLAYER) {
            this.playerTank = tank;
        } else {
            this.enemies.push(tank);
        }
    }

    moveTank() {
        const point = this.playerTank.move(true);
        if (!this.isCollisionDetected(point.x, point.y, this.playerTank.getDirection())) {
            this.playerTank.move(false);
        }
        this.spriteService.rerenderScene();
    }

    public shoot() {
        //TODO SCALE in elem //ONE time create please
        const boardSprite = this.spriteService.createBoardElem(TankAsset, TankAsset.BULLET, this.playerTank.getX(), this.playerTank.getY(), 0.5, true);
        const newBulletCreated = this.playerTank.createBullet(boardSprite);
        if (!newBulletCreated) {
            this.spriteService.removeSprites(boardSprite);
        } else {
            this.spriteService.playSound(SoundAsset.SHOOT_SOUND);
        }
    }

    everyTick(delta: any) {
        this.moveTank();
        //TODO allTanks as field
        let allTanks = this.enemies;
        allTanks.push(this.playerTank);
        this.bonusService.handleBonuses(this.board, allTanks);

        const newPoint = this.playerTank.moveBullet();
        let barrier = newPoint ? this.isCollisionDetectedForBullet(newPoint.x, newPoint.y, this.playerTank.getBulletDirection()) : null;

        if (barrier) {
            this.spriteService.removeSprites(this.playerTank.getBullet().boardSprite);
            this.playerTank.explodeBullet();
            let onComplete = barrier.isDestroyable ? () => this.removeBoardElem(barrier) : () => {};
            this.spriteService.playAnimation(AnimationAsset.SMALL_EXPLODE, newPoint.x, newPoint.y, onComplete);
            if (barrier instanceof Eagle) {
                this.successGameOver$.next(false);
            }
        }
    }

    private removeBoardElem(boardElem: BoardElement) {
        this.board[boardElem.boardSprite.boardX][boardElem.boardSprite.boardY] = null;
        this.spriteService.removeSprites(boardElem.boardSprite);
    }

    private isCollisionDetectedForBullet(newX: number, newY: number, direction: Direction): BoardElement {
        let currentCeil;
        let nextCeil;
        switch (direction) {
            case Direction.UP:
                currentCeil = this.board[Math.round(newX)][GameManagerService.ceil(newY)];
                nextCeil = this.board[Math.round(newX)][GameManagerService.ceil(newY) - 1];
                break;
            case Direction.DOWN:
                currentCeil = this.board[Math.round(newX)][GameManagerService.floor(newY)];
                nextCeil = this.board[Math.round(newX)][GameManagerService.floor(newY) + 1];
                break;
            case Direction.LEFT :
                currentCeil = this.board[GameManagerService.ceil(newX)][Math.round(newY)];
                nextCeil = this.board[GameManagerService.ceil(newX) - 1][Math.round(newY)];
                break;
            case Direction.RIGHT:
                currentCeil = this.board[GameManagerService.floor(newX)][Math.round(newY)];
                nextCeil = this.board[GameManagerService.floor(newX) + 1][Math.round(newY)];
                break;
        }
        if (currentCeil != null && !currentCeil.isSkippedByBullet) {
            return currentCeil;
        }
        return nextCeil != null && !nextCeil.isDestroyable && !nextCeil.isSkippedByBullet ? nextCeil : null;
    }

    //TODO pass tank
    private isCollisionDetected(newX: number, newY: number, direction: Direction): boolean {
        let leftCeil;
        let rightCeil;

        switch (direction) {
            case Direction.UP:
                leftCeil = this.board[GameManagerService.floor(newX)][GameManagerService.floor(newY)];
                rightCeil = this.board[GameManagerService.ceil(newX)][GameManagerService.floor(newY)];
                break;
            case Direction.DOWN:
                leftCeil = this.board[GameManagerService.floor(newX)][GameManagerService.ceil(newY)];
                rightCeil = this.board[GameManagerService.ceil(newX)][GameManagerService.ceil(newY)];
                break;
            case Direction.LEFT :
                leftCeil = this.board[GameManagerService.floor(newX)][GameManagerService.floor(newY)];
                rightCeil = this.board[GameManagerService.floor(newX)][GameManagerService.ceil(newY)];
                break;
            case Direction.RIGHT:
                leftCeil = this.board[GameManagerService.ceil(newX)][GameManagerService.floor(newY)];
                rightCeil = this.board[GameManagerService.ceil(newX)][GameManagerService.ceil(newY)];
                break;
        }

        const water = this.board[Math.round(newX)][Math.round(newY)];
        if (water != null && water instanceof Water) {
            this.takeLife$.next(this.playerTank);
        }

        return (leftCeil != null && leftCeil.isBarrier) || (rightCeil != null && rightCeil.isBarrier);
    }

    private static floor(coordinate: number): number {
        return Math.floor(coordinate) > 0 ? Math.floor(coordinate) : 0;
    }

    private static ceil(coordinate: number) {
        return Math.ceil(coordinate) < 32 ? Math.ceil(coordinate) : 31;
    }

    createBoardElem(x: number, y: number, boardObjectName: string, wallType?: number) {
        this.board[x][y] = this.boardElementFactory.createBoardElem(boardObjectName, x, y, wallType);
    }

    private boardInitialize() {
        this.board = [];
        for (let i = 0; i < 32; i++) {
            this.board[i] = [];
            for (let j = 0; j < 32; j++) {
                this.board[i][j] = null;
            }
        }
    }

    private resolveTankSituation(tank: Tank) {
        tank.takeLife();
        console.log("isDead " + tank.isDead());
        if (tank.isDead()) {
            this.successGameOver$.next(false);
        } else {
            tank.boardSprite.changeX(this.playerTank.startX);
            tank.boardSprite.changeY(this.playerTank.startY);
        }
    }
}