import {noop, Subject, Subscription} from "rxjs";
import {BoardModel} from "../api/boardModel";
import {TankModel} from "../api/tankModel";
import {AnimationAsset, SoundAsset} from "../model/asset";
import {Board} from "../model/board";
import {BoardElement, BoardObject, Eagle, Point, Wall} from "../model/boardElement";
import {Game} from "../model/game";
import {Bullet, Tank, TankType} from "../model/tank";
import {AssetService} from "./asset.service";
import {BoardElementsFactory} from "./boardElements.factory";
import {BonusService} from "./bonus.service";
import {StatisticService} from "./statistics.service";
import {TankManagerService} from "./tankManager.service";

export class GameManagerService {
    public readonly board: Board;
    public readonly successGameOver$ = new Subject<boolean>();

    private readonly spriteService: AssetService;
    private readonly boardElementFactory: BoardElementsFactory;

    private bonusService: BonusService;
    private tankManagerService: TankManagerService;
    private statisticsService: StatisticService;
    private game: Game;

    private takeLife$: Map<Tank, Subscription> = new Map<Tank, Subscription>();
    private killTank$: Map<Bullet, Subscription> = new Map<Bullet, Subscription>();
    private explodes$: Map<Bullet, Subscription> = new Map<Bullet, Subscription>();

    constructor(spriteService: AssetService, statisticService: StatisticService, game: Game) {
        this.game = game;
        this.spriteService = spriteService;
        this.statisticsService = statisticService;

        this.boardElementFactory = new BoardElementsFactory(this.spriteService);
        this.bonusService = new BonusService(this.spriteService, this.boardElementFactory);
        this.board = new Board();
        this.tankManagerService = new TankManagerService(this.board, this.boardElementFactory, this.spriteService);
    }

    public generateBoard(boardResponse: any, tankResponse: any) {
        const boardModel = boardResponse as BoardModel;
        const tankModel = tankResponse as TankModel;

        this.createBoardBorder();

        Object.keys(boardModel).forEach((key) => {
            boardModel[key].assets.forEach((asset) => {
                this.createBoardElem(asset.x, asset.y, boardModel[key].boardElem, boardModel[key].type);
            });
        });

        this.tankManagerService.initializeTanks(tankModel);
        this.statisticsService.initializeStatisticsBoard();

        this.spriteService.rerenderScene();
        this.board.getAllTanks().forEach((tank) => this.subscribeOnTankEvents(tank));
    }

    public shoot() {
        if (!this.board.getPlayerTank().getBullet().isActive()) {
            this.board.getPlayerTank().activateBullet();
            this.spriteService.playSound(SoundAsset.SHOOT_SOUND);
        }
    }

    public everyTick() {
        this.bonusService.handleBonuses(this.board);
        this.tankManagerService.moveTanks();
        this.tankManagerService.handleBullets();
        this.spriteService.rerenderScene();
    }

    public createBoardElem(x: number, y: number, boardObjectName: string, wallType?: number) {
        this.board.addBoardElemToBoard(this.boardElementFactory.createBoardElem(boardObjectName, x, y, wallType), x, y);
    }

    private createBoardBorder() {
        for (let i = 0; i < Board.BOARD_SIZE; i++) {
            this.createBoardElem(0, i, BoardObject.BLOCK);
            this.createBoardElem(31, i, BoardObject.BLOCK);
            this.createBoardElem(i, 0, BoardObject.BLOCK);
            this.createBoardElem(i, 31, BoardObject.BLOCK);
        }
    }

    private removeBoardElem(boardElem: BoardElement) {
        this.board.removeElem(boardElem.boardSprite.boardX, boardElem.boardSprite.boardY);
        this.spriteService.removeSprites(boardElem.boardSprite);
    }

    private subscribeOnTankEvents(tank: Tank) {
        this.takeLife$.set(tank, tank.lifeTaken$.subscribe((t) => this.resolveTankSituation(t)));
        this.explodes$.set(tank.getBullet(), tank.getBullet().explode$.subscribe((b) => this.handleExplosion(b)));
        this.killTank$.set(tank.getBullet(), tank.getBullet().killTank$.subscribe(
            (t) => this.handleTankKilling(t)));
    }

    private unsubscribeFromTank(tank: Tank) {
        this.takeLife$.get(tank).unsubscribe();
        this.takeLife$.delete(tank);

        this.explodes$.get(tank.getBullet()).unsubscribe();
        this.explodes$.delete(tank.getBullet());

        this.killTank$.get(tank.getBullet()).unsubscribe();
        this.killTank$.delete(tank.getBullet());
    }

    private handleTankKilling(tank: Tank) {
        const killed = tank.takeWound();
        if (killed) {
            this.spriteService.playAnimation(AnimationAsset.EXPLODE, tank.boardSprite.boardX, tank.boardSprite.boardY);
            this.spriteService.playSound(SoundAsset.EXPLODE_SOUND);
            tank.removeFromBoard();
        }
    }

    private handleExplosion(bullet: Bullet) {
        const boardElement = this.board.getBoardElemToBoard(bullet.boardSprite.boardX, bullet.boardSprite.boardY);
        let onComplete = noop();
        if (boardElement && boardElement.isDestroyable) {
            if (boardElement instanceof Eagle) {
                this.successGameOver$.next(false);
            }
            if (bullet === this.board.getPlayerTank().getBullet() && boardElement instanceof Wall) {
                this.statisticsService.addWallToStatistics();
            }
            this.spriteService.playSound(SoundAsset.HIT_SOUND);
            onComplete = this.removeBoardElem(boardElement);
        }
        this.spriteService.playAnimation(AnimationAsset.SMALL_EXPLODE, bullet.boardSprite.boardX,
            bullet.boardSprite.boardY, onComplete);
        bullet.explode();
    }

    private resolveTankSituation(tank: Tank) {
        if (tank.isDead()) {
            if (tank.tankType === TankType.PLAYER) {
                this.successGameOver$.next(false);
                this.takeLife$.forEach((value) => value.unsubscribe());
            } else {
                this.unsubscribeFromTank(tank);
                this.statisticsService.addTankToStatistics();
                const newTank = this.tankManagerService.replaceTank(tank);
                if (newTank) {
                    this.subscribeOnTankEvents(newTank);
                } else {
                    if (this.board.getOthersTanks().length <= 0) {
                        this.successGameOver$.next(true);
                    }
                }
            }
        } else {
            tank.removeFromBoard();
            setTimeout(() => tank.boardSprite.changePosition(new Point(tank.startX, tank.startY)), 700);
        }
    }
}
