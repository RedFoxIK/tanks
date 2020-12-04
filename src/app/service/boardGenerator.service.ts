import {SpriteService} from "./sprite.service";
import {BoardAsset, ButtonAsset, LoaderAsset} from "../model/asset";
import PIXI from "pixi.js";
import {Game, GameState} from "../model/game";
// @ts-ignore
import boarMapResponse from '../api/board-map.json';
import {BoardElementsFactory} from "./boardElements.factory";
import {BoardObject} from "../model/boardElement";
import {BoardSprite} from "../model/spriteWrapper";

export class BoardGeneratorService {
    readonly boardSize = 32;

    private spriteService: SpriteService;
    private game: Game;

    constructor(game: Game, app: PIXI.Application, view: HTMLElement) {
        this.game = game;
        this.spriteService = new SpriteService(app, view);
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
        for (let i = 1; i <= 32; i++) {
            this.createBoardElem(BoardAsset, BoardAsset.BLOCK, 1, i, BoardObject.BLOCK);
            this.createBoardElem(BoardAsset, BoardAsset.BLOCK, 32, i, BoardObject.BLOCK);
            this.createBoardElem(BoardAsset, BoardAsset.BLOCK, i, 1, BoardObject.BLOCK);
            this.createBoardElem(BoardAsset, BoardAsset.BLOCK, i, 32, BoardObject.BLOCK);
        }

        Object.keys(boarMapResponse).forEach(key => {
            boarMapResponse[key].assets.forEach(asset => {
                this.createBoardElem(BoardAsset, BoardAsset[boarMapResponse[key].enumValue], asset.x, asset.y, asset.boardElem)
            });
        })
    }



    createBoardElem(assetEnum, assetEnumValue: string, x: number, y: number, boardName: string) {
        const boardElement = this.spriteService.createBoardElem(assetEnum, assetEnumValue, x, y);
    }
}
