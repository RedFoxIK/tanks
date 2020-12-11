import {SpriteService} from "./sprite.service";
import {AnimationAsset, BoardAsset, ButtonAsset, LoaderAsset, SoundAsset, TankAsset} from "../model/asset";
import * as PIXI from "pixi.js";
import {Game, GameState} from "../model/game";
import {BoardElement, BoardObject} from "../model/boardElement";
import {BoardSprite} from "../model/spriteWrapper";
import {BoardElementsFactory} from "./boardElements.factory";
import { default as PIXI_SOUND } from 'pixi-sound';
//TODO: move to controller
import boardMapResponse from "../api/board-map.json";
import tanksResponse from "../api/tanks.json";
import {Tank, TankType} from "../model/tank";
import {Direction} from "../model/direction";

export class BoardGeneratorService {
    readonly boardSize = 32;

    private spriteService: SpriteService;
    private game: Game;
    private board: BoardElement | null [][];
    private playerTank: Tank;
    private enemies: Tank[];

    constructor(game: Game, app: PIXI.Application, view: HTMLElement) {
        this.game = game;
        this.spriteService = new SpriteService(app, view)
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
            this.createBoardElem(BoardAsset, BoardAsset.BLOCK, 0, i, BoardObject.BLOCK);
            this.createBoardElem(BoardAsset, BoardAsset.BLOCK, 31, i, BoardObject.BLOCK);
            this.createBoardElem(BoardAsset, BoardAsset.BLOCK, i, 0, BoardObject.BLOCK);
            this.createBoardElem(BoardAsset, BoardAsset.BLOCK, i, 31, BoardObject.BLOCK);
        }

        Object.keys(boardMapResponse).forEach(key => {
            boardMapResponse[key].assets.forEach(asset => {
                this.createBoardElem(BoardAsset, BoardAsset[boardMapResponse[key].enumValue], asset.x, asset.y, boardMapResponse[key].boardElem)
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
        const boardSprite = this.spriteService.createBoardElem(assetEnum, assetEnumValue, x, y, true, true);
        const tank = new Tank(boardSprite, tankType);
        if (tankType == TankType.PLAYER) {
            this.playerTank = tank;
        } else {
            this.enemies.push(tank);
        }
    }

    moveTank(direction: Direction) {
        const point = this.playerTank.move(direction, true);
        if (!this.isCollisionDetected(point.x, point.y, direction)) {
            this.playerTank.move(direction, false);
        }
        this.spriteService.rerenderScene();
    }

    isCollisionDetected(newX: number, newY: number, direction: Direction): boolean {
        let leftCeil;
        let rightCeil;

        switch (direction) {
            case Direction.UP:
                leftCeil = this.board[Math.floor(newX)][Math.floor(newY)];
                rightCeil = this.board[Math.ceil(newX)][Math.floor(newY)];
                break;
            case Direction.DOWN:
                leftCeil = this.board[Math.floor(newX)][Math.ceil(newY)];
                rightCeil = this.board[Math.ceil(newX)][Math.ceil(newY)];
                break;
            case Direction.LEFT:
                leftCeil = this.board[Math.floor(newX)][Math.floor(newY)];
                rightCeil = this.board[Math.floor(newX)][Math.ceil(newY)];
                break;
            case Direction.RIGHT:
                leftCeil = this.board[Math.ceil(newX)][Math.floor(newY)];
                rightCeil = this.board[Math.ceil(newX)][Math.ceil(newY)];
                break;
        }
        return (leftCeil != null && leftCeil.isBarrier) || (rightCeil != null && rightCeil.isBarrier);
    }

    createBoardElem(assetEnum, assetEnumValue: string, x: number, y: number, boardObjectName: string) {
        const boardSprite = this.spriteService.createBoardElem(assetEnum, assetEnumValue, x, y);
        this.board[x][y] = BoardElementsFactory.createBoardElem(boardObjectName, boardSprite);
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
