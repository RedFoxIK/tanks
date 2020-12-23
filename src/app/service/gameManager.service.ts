import {BoardElement, BoardObject, Eagle, Wall} from "../model/boardElement";
import {AnimationAsset, SoundAsset} from "../model/asset";
import {Bullet, Tank, TankType} from "../model/tank";
import {Game} from "../model/game";
import {SpriteService} from "./sprite.service";
import {BoardElementsFactory} from "./boardElements.factory";
import {Subject, Subscription} from "rxjs";
import {BonusService} from "./bonus.service";
import {Board} from "../model/board";
import {CollisionResolverService} from "./collisionResolver.service";
import {TankManagerService} from "./tankManager.service";
import {StatisticService} from "./statistics.service";

export class GameManagerService {
    private spriteService: SpriteService;
    private boardElementFactory: BoardElementsFactory;
    private bonusService: BonusService;
    private tankManagerService: TankManagerService;
    private statisticsService: StatisticService;

    private game: Game;
    readonly board: Board;

    private takeLife$: Map<Tank, Subscription> = new Map<Tank, Subscription>();
    private killTank$: Map<Bullet, Subscription> = new Map<Bullet, Subscription>();
    private explodes$: Map<Bullet, Subscription> = new Map<Bullet, Subscription>();

    successGameOver$ = new Subject<boolean>();

    constructor(spriteService: SpriteService, game: Game) {
        this.game = game;
        this.spriteService = spriteService;
        this.boardElementFactory = new BoardElementsFactory(this.spriteService);
        this.bonusService = new BonusService(this.spriteService, this.boardElementFactory);
        this.board = new Board();
        this.tankManagerService = new TankManagerService(this.board, this.boardElementFactory, this.spriteService);
        this.statisticsService = new StatisticService(this.spriteService);
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

        this.tankManagerService.initializeTanks();
        this.spriteService.rerenderScene();
        this.spriteService.playSound(SoundAsset.WIN_SOUND);

        this.subscribe();
        this.statisticsService.initializeStatisticsBoard();
    }

    private subscribe() {
        this.board.getAllTanks().forEach(tank => {
            this.takeLife$.set(tank, tank.lifeTaken$.subscribe(t => this.resolveTankSituation(t)));
            this.explodes$.set(tank.getBullet(), tank.getBullet().explode$.subscribe(b => this.handleExplosion(b)));
            this.killTank$.set(tank.getBullet(), tank.getBullet().killTank$.subscribe(t => this.handleTankKilling(t)));
        });
    }

    private handleTankKilling(tank: Tank) {
        this.spriteService.playAnimation(AnimationAsset.EXPLODE, tank.boardSprite.boardX, tank.boardSprite.boardY);
        this.spriteService.playSound(SoundAsset.EXPLODE_SOUND);
        tank.removeFromBoard();
        tank.takeLife();

        if (this.board.getOthersTanks().length <= 0) {
            this.successGameOver$.next(true);
        }
    }

    private handleExplosion(bullet: Bullet) {
        const boardElement = this.board.getBoardElemToBoard(bullet.boardSprite.boardX, bullet.boardSprite.boardY);
        let onComplete = () => {};
        if (boardElement && boardElement.isDestroyable) {
            if (boardElement instanceof Eagle) {
                this.successGameOver$.next(false);
            }
            if (bullet == this.board.getPlayerTank().getBullet() && boardElement instanceof Wall) {
                this.statisticsService.addWallToStatistics();
            }
            this.spriteService.playSound(SoundAsset.HIT_SOUND);
            onComplete = () => this.removeBoardElem(boardElement);
        }
        this.spriteService.playAnimation(AnimationAsset.SMALL_EXPLODE, bullet.boardSprite.boardX, bullet.boardSprite.boardY, onComplete);
        bullet.explode();
    }

    moveTank() {
        const newPoint = this.board.getPlayerTank().retrieveNextMovement();
        if (newPoint && !CollisionResolverService.isCollisionDetectedForTank(this.board.getPlayerTank(), newPoint, this.board)) {
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
        CollisionResolverService.retrieveTargetForBullet(this.board.getPlayerTank().getBullet(), this.board);

        const bullets = this.board.getOthersTanks().map(tank => tank.getBullet());
        bullets.forEach(b => {
            const newPoint = b.retrieveNextMovement();
            b.move(newPoint);
            CollisionResolverService.retrieveTargetForBullet(b, this.board);
        });

        this.tankManagerService.moveEnemies();
        CollisionResolverService.calculateBulletsWithTankCollisions(this.board);

        this.spriteService.rerenderScene();
    }



    private removeBoardElem(boardElem: BoardElement) {
        this.board.removeElem(boardElem.boardSprite.boardX, boardElem.boardSprite.boardY);
        this.spriteService.removeSprites(boardElem.boardSprite);
    }

    createBoardElem(x: number, y: number, boardObjectName: string, wallType?: number) {
        this.board.addBoardElemToBoard(this.boardElementFactory.createBoardElem(boardObjectName, x, y, wallType), x, y);
    }

    private resolveTankSituation(tank: Tank) {
        if (tank.isDead()) {
            if (tank.tankType == TankType.PLAYER) {
                this.successGameOver$.next(false)
                this.takeLife$.forEach((value) => value.unsubscribe());
            } else {
                this.takeLife$.forEach((value, key) => console.log(key));
                this.takeLife$.get(tank).unsubscribe();
                this.takeLife$.delete(tank);

                this.explodes$.get(tank.getBullet()).unsubscribe()
                this.explodes$.delete(tank.getBullet());

                this.killTank$.get(tank.getBullet()).unsubscribe()
                this.killTank$.delete(tank.getBullet());

                this.statisticsService.addTankToStatistics();

                const newTank = this.tankManagerService.replaceTank(tank);
                if (newTank) {
                    this.takeLife$.set(newTank, newTank.lifeTaken$.subscribe(t => this.resolveTankSituation(t)));
                    this.takeLife$.forEach((value, key) => console.log(key));
                    this.explodes$.set(newTank.getBullet(), newTank.getBullet().explode$.subscribe(b => this.handleExplosion(b)));
                    this.killTank$.set(newTank.getBullet(), newTank.getBullet().killTank$.subscribe(t => this.handleTankKilling(t)));
                }
            }
        } else {
            tank.removeFromBoard();
            setTimeout(() => {
                tank.boardSprite.changeX(tank.startX);
                tank.boardSprite.changeY(tank.startY);
            }, 700);
        }
    }

    getScores(): number {
        return this.statisticsService.retrieveTotalScores();
    }
}