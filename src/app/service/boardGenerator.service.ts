import {SpriteService} from "./sprite.service";
import {BoardAsset, ButtonAsset, LoaderAsset, TankAsset} from "../model/asset";
import PIXI from "pixi.js";
import {Game, GameState} from "../model/game";
import {BoardObject} from "../model/boardElement";
import {BoardSprite} from "../model/spriteWrapper";
import {BoardElementsFactory} from "./boardElements.factory";
//TODO: move to controller
import boarMapResponse from "../api/board-map.json";
import tanksResponse from "../api/tanks.json";
import {Tank, TankType} from "../model/tank";
import {Direction} from "../model/direction";

export class BoardGeneratorService {
    readonly boardSize = 32;

    private spriteService: SpriteService;
    private game: Game;
    private board: BoardSprite | null [][];
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

        this.createTank(TankAsset, TankAsset.TANK, tanksResponse.player.x, tanksResponse.player.y, TankType.PLAYER);
        tanksResponse.enemies.forEach(enemy => {
            this.createTank(TankAsset, TankAsset.ENEMY_TANK_1, enemy.x, enemy.y, TankType.ENEMY);
        })

        Object.keys(boarMapResponse).forEach(key => {
            boarMapResponse[key].assets.forEach(asset => {
                this.createBoardElem(BoardAsset, BoardAsset[boarMapResponse[key].enumValue], asset.x, asset.y, boarMapResponse[key].boardElem)
            });
        })
    }

    createTank(assetEnum, assetEnumValue: string, x: number, y: number, tankType: TankType) {
        const boardSprite = this.spriteService.createBoardElem(assetEnum, assetEnumValue, x, y, true);
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
        switch (direction) {
            case Direction.UP:
                if ((newX * 10) % 10 == 0) {
                    return this.board[newX][Math.floor(newY)] != null;
                }
                return this.board[Math.floor(newX)][Math.floor(newY)] != null || this.board[Math.ceil(newX)][Math.floor(newY)];
            case Direction.DOWN:
                if ((newX * 10) % 10 == 0) {
                    return this.board[newX][Math.ceil(newY)] != null;
                }
                return this.board[Math.floor(newX)][Math.ceil(newY)] != null || this.board[Math.ceil(newX)][Math.ceil(newY)] != null;
            case Direction.LEFT:
                if ((newY * 10) % 10 == 0) {
                    return this.board[Math.floor(newX)][newY] != null;
                }
                return this.board[Math.floor(newX)][Math.floor(newY)] != null || this.board[Math.floor(newX)][Math.ceil(newY)] != null;
            case Direction.RIGHT:
                if ((newY * 10) % 10 == 0) {
                    return this.board[Math.ceil(newX)][newY] != null;
                }
                return this.board[Math.ceil(newX)][Math.floor(newY)] != null || this.board[Math.ceil(newX)][Math.ceil(newY)] != null;
        }
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
