import {SpriteService} from "./sprite.service";
import {BoardAsset, ButtonAsset, LoaderAsset, TankAsset} from "../model/asset";
import * as PIXI from "pixi.js";
import { default as PIXI_SOUND } from 'pixi-sound';
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
        let sheet = this.spriteService.loader.resources["EXPLODE_ANIM"].spritesheet;
        console.log( this.spriteService.loader.resources);
        console.log(sheet);
        const anim = new PIXI.AnimatedSprite(sheet.animations['explode'])
        console.log(anim);
        anim.animationSpeed = 0.5;
        anim.x = 200;
        anim.y = 300;
        anim.width = 48;
        anim.height = 48;
        anim.loop = false;
        this.spriteService.stage.addChild(anim);
        anim.play();
        anim.onComplete = () => this.spriteService.stage.removeChild(anim);

        let sheet3 = this.spriteService.loader.resources["APPEAR_ANIM"].spritesheet;

        const anim3 = new PIXI.AnimatedSprite(sheet3.animations['appear']);
        anim3.animationSpeed = 0.5;
        anim3.x = 64;
        anim3.y = 64;
        anim3.width = 48;
        anim3.loop = false;
        anim3.height = 48;
        this.spriteService.stage.addChild(anim3);
        anim3.onComplete = () => this.spriteService.stage.removeChild(anim3);
        anim3.play();

        let sheet2 = this.spriteService.loader.resources["EXPLODE_SMALL_ANIM"].spritesheet;

        const anim2 = new PIXI.AnimatedSprite(sheet2.animations['small'])
        anim2.anchor.set(0.5);
        anim2.animationSpeed = 0.2;
        anim2.x = 600;
        anim2.y = 300;
        anim2.loop = false;
        anim2.width = 48;
        anim2.height = 48;
        this.spriteService.stage.addChild(anim2);
        anim2.play();
        anim2.onComplete = () => this.spriteService.stage.removeChild(anim2);


        // PIXI_SOUND.add('hit', 'assets/sounds/hit.wav');
        // PIXI_SOUND.play('hit');

        // PIXI_SOUND.add('bonus', 'assets/sounds/bonus.wav');
        // PIXI_SOUND.play('bonus');

        // PIXI_SOUND.add('lose', 'assets/sounds/lose.wav');
        // PIXI_SOUND.play('lose');
        //
        // PIXI_SOUND.add('win', 'assets/sounds/win.wav');
        // PIXI_SOUND.play('win');
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
