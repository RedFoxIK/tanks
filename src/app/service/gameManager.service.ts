import {BoardElement, BoardObject, Eagle, Water} from "../model/boardElement";
import {AnimationAsset, SoundAsset} from "../model/asset";
import tanksResponse from "../api/tanks.json";
import {Tank, TankType} from "../model/tank";
import {Direction} from "../model/direction";
import {Game} from "../model/game";
import {SpriteService} from "./sprite.service";
import {BoardElementsFactory} from "./boardElements.factory";
import {Subject} from "rxjs";
import {BonusService} from "./bonus.service";
import {Board} from "../model/board";
import {CollisionResolverService} from "./collisionResolver.service";

export class GameManagerService {
    private spriteService: SpriteService;
    private boardElementFactory: BoardElementsFactory;
    private bonusService: BonusService;

    private game: Game;
    readonly board: Board;

    private takeLife$ = new Subject<Tank>();
    successGameOver$ = new Subject<boolean>();

    constructor(spriteService: SpriteService, game: Game) {
        this.game = game;
        this.spriteService = spriteService;
        this.boardElementFactory = new BoardElementsFactory(this.spriteService);
        this.takeLife$.subscribe(tank => this.resolveTankSituation(tank));

        this.bonusService = new BonusService(this.spriteService, this.boardElementFactory);
        this.board = new Board();
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

        this.createTank(tanksResponse.player.x, tanksResponse.player.y, TankType.PLAYER);
        tanksResponse.enemies.forEach(enemy => this.createTank(enemy.x, enemy.y, TankType.ENEMY));
        this.spriteService.rerenderScene();
        this.spriteService.playSound(SoundAsset.WIN_SOUND);

        this.subscribe();
    }

    private subscribe() {
        this.board.getAllTanks().forEach(tank => tank.lifeTaken$.subscribe(tank => this.resolveTankSituation(tank)));
    }

    createTank(x: number, y: number, tankType: TankType) {
        const tank = this.boardElementFactory.createTank(x, y, tankType);
        this.board.addTankToBoard(tank);
    }

    moveTank() {
        const newPoint = this.board.getPlayerTank().retrieveNextMovement();
        if (newPoint && !CollisionResolverService.isCollisionDetected(this.board.getPlayerTank(), newPoint, this.board)) {
            this.board.getPlayerTank().move(newPoint);
        }
    }

    public shoot() {
        const newBulletCreated = this.board.getPlayerTank().activateBullet();
        if (newBulletCreated) {
            this.spriteService.playSound(SoundAsset.SHOOT_SOUND);
        }
    }

    everyTick() {
        this.moveTank();
        this.bonusService.handleBonuses(this.board);

        const newPoint = this.board.getPlayerTank().getBullet().retrieveNextMovement();
        this.board.getPlayerTank().getBullet().move(newPoint);
        let barrier = newPoint ? CollisionResolverService.retrieveTargetForBullet(this.board.getPlayerTank().getBullet(), this.board) : null;

        if (barrier) {
            this.board.getPlayerTank().explodeBullet();
            let onComplete = barrier.isDestroyable ? () => this.removeBoardElem(barrier) : () => {};
            this.spriteService.playAnimation(AnimationAsset.SMALL_EXPLODE, newPoint.x, newPoint.y, onComplete);

            if (barrier instanceof Eagle) {
                this.successGameOver$.next(false);
            }
        }
        this.board.getOthersTanks().forEach(tank => this.moveEnemyTank(tank));
        this.spriteService.rerenderScene();
    }

    private moveEnemyTank(tank: Tank) {
        tank.setDirection(Direction.DOWN);
        const point = tank.retrieveNextMovement();
        if (!CollisionResolverService.isCollisionDetected(tank, point, this.board)) {
            tank.move(point);
        }
    }

    private removeBoardElem(boardElem: BoardElement) {
        this.board.removeElem(boardElem.boardSprite.boardX, boardElem.boardSprite.boardY);
        this.spriteService.removeSprites(boardElem.boardSprite);
    }


    createBoardElem(x: number, y: number, boardObjectName: string, wallType?: number) {
        this.board.addBoardElemToBoard(this.boardElementFactory.createBoardElem(boardObjectName, x, y, wallType), x, y);
    }


    private resolveTankSituation(tank: Tank) {
        tank.takeLife();
        if (tank.isDead()) {
           tank.tankType == TankType.PLAYER ? this.successGameOver$.next(false) : this.spriteService.removeSprites(tank.boardSprite);
        } else {
            tank.removeFromBoard();
            setTimeout(() => {
                tank.boardSprite.changeX(this.board.getPlayerTank().startX);
                tank.boardSprite.changeY(this.board.getPlayerTank().startY);
            }, 200);
        }
    }
}