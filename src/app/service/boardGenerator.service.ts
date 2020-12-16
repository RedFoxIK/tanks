import {SpriteService} from "./sprite.service";
import {AnimationAsset, ButtonAsset, LoaderAsset, SoundAsset, TankAsset} from "../model/asset";
import * as PIXI from "pixi.js";
import {Game, GameState} from "../model/game";
import {BoardElement, BoardObject} from "../model/boardElement";
import {BoardElementsFactory} from "./boardElements.factory";
//TODO: move to controller
import boardMapResponse from "../api/board-map.json";
import tanksResponse from "../api/tanks.json";
import {Tank, TankType} from "../model/tank";
import {Direction} from "../model/direction";

export class BoardGeneratorService {
    readonly boardSize = 32;

    private spriteService: SpriteService;
    private boardElementFactory: BoardElementsFactory;

    private game: Game;
    private board: BoardElement | null [][];
    private enemies: Tank[];
    playerTank: Tank;

    constructor(game: Game, app: PIXI.Application, view: HTMLElement) {
        this.game = game;
        this.spriteService = new SpriteService(app, view);
        this.boardElementFactory = new BoardElementsFactory(this.spriteService);
        this.enemies = [];
        this.boardInitialize();
    }

    public generatePreloadedBoard() {
        this.spriteService.addText('Tank Game', 280, 200, 100);
        const progressBg = this.spriteService.addSprite(LoaderAsset, LoaderAsset.LOADER_BG, 200, 500, 600, 80);
        const progressBar = this.spriteService.addSprite(LoaderAsset, LoaderAsset.LOADER_BAR, 205, 505, 0, 70);

        const onProgress = e => {
            progressBar.changeWidth(590 * (e.progress * 0.01));
            this.spriteService.rerenderScene();
        };

        const onComplete = () => {
            this.spriteService.removeSprites(progressBg, progressBar);
            const startBtn = this.spriteService.addSprite(ButtonAsset, ButtonAsset.START, 350, 450);
            this.spriteService.makeSpriteInteractive(startBtn, true,
                "pointerdown", () => {
                    this.spriteService.clearScene()
                    this.game.changeState(GameState.IN_PROGRESS);
                });
        }
        this.spriteService.loadAssets(onProgress, onComplete);
    }

    public generateBoard() {

        for (let i = 0; i < 32; i++) {
            this.createBoardElem(0, i, BoardObject.BLOCK);
            this.createBoardElem(31, i, BoardObject.BLOCK);
            this.createBoardElem(i, 0, BoardObject.BLOCK);
            this.createBoardElem(i, 31, BoardObject.BLOCK);
        }

        Object.keys(boardMapResponse).forEach(key => {
            boardMapResponse[key].assets.forEach(asset => {
                this.createBoardElem(asset.x, asset.y, boardMapResponse[key].boardElem, boardMapResponse[key].type)
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
        const boardSprite = this.spriteService.createBoardElem(assetEnum, assetEnumValue, x, y, 1,true, true);
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
        const boardSprite = this.spriteService.createBoardElem(TankAsset, TankAsset.BULLET, this.playerTank.getX(), this.playerTank.getY(), 0.5);
        const newBulletCreated = this.playerTank.createBullet(boardSprite);
        if (!newBulletCreated) {
            this.spriteService.removeSprites(boardSprite);
        } else {
            this.spriteService.playSound(SoundAsset.SHOOT_SOUND);
        }
    }

    everyTick(delta: any) {
        //TODO newPoint can be taken from bullet
        this.moveTank();

        const newPoint = this.playerTank.moveBullet();
        if (newPoint && this.isCollisionDetected(newPoint.x, newPoint.y, this.playerTank.getBulletDirection())) {
            this.spriteService.removeSprites(this.playerTank.getBullet().boardSprite);
            this.playerTank.explodeBullet();
            this.spriteService.playAnimation(AnimationAsset.SMALL_EXPLODE, newPoint.x, newPoint.y, () => {});
        }
    }

    private isCollisionDetected(newX: number, newY: number, direction: Direction): boolean {
        let leftCeil;
        let rightCeil;

        switch (direction) {
            case Direction.UP:
                leftCeil = this.board[BoardGeneratorService.floor(newX)][BoardGeneratorService.floor(newY)];
                rightCeil = this.board[BoardGeneratorService.ceil(newX)][BoardGeneratorService.floor(newY)];
                break;
            case Direction.DOWN:
                leftCeil = this.board[BoardGeneratorService.floor(newX)][BoardGeneratorService.ceil(newY)];
                rightCeil = this.board[BoardGeneratorService.ceil(newX)][BoardGeneratorService.ceil(newY)];
                break;
            case Direction.LEFT :
                leftCeil = this.board[BoardGeneratorService.floor(newX)][BoardGeneratorService.floor(newY)];
                rightCeil = this.board[BoardGeneratorService.floor(newX)][BoardGeneratorService.ceil(newY)];
                break;
            case Direction.RIGHT:
                leftCeil = this.board[BoardGeneratorService.ceil(newX)][BoardGeneratorService.floor(newY)];
                rightCeil = this.board[BoardGeneratorService.ceil(newX)][BoardGeneratorService.ceil(newY)];
                break;
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
}
