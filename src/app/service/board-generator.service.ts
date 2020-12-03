import {SpriteService} from "./sprite.service";
import {BoardAsset, ButtonAsset, LoaderAsset} from "../model/asset";
import PIXI from "pixi.js";
import {Game, GameState} from "../model/game";
import boarMapResponse from '../api/board-map.json';

export class BoardGeneratorService {
    readonly boardSize = 32;
    readonly spriteSize = 24;

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
            progressBar.sprite.width = 590 * (e.progress * 0.01);
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
            this.createBoardElem(BoardAsset, BoardAsset.BLOCK, 1, i);
            this.createBoardElem(BoardAsset, BoardAsset.BLOCK, 32, i);
            this.createBoardElem(BoardAsset, BoardAsset.BLOCK, i, 1);
            this.createBoardElem(BoardAsset, BoardAsset.BLOCK,  i, 32);
        }
        const eagle = boarMapResponse.eagle;
        this.createBoardElem(BoardAsset, BoardAsset.EAGLE, eagle.x, eagle.y);

        const waterElems = boarMapResponse.water;
        waterElems.forEach(w => this.createBoardElem(BoardAsset, BoardAsset.WATER, w.x, w.y));

        const leaves = boarMapResponse.leaves;
        leaves.forEach(l => this.createBoardElem(BoardAsset, BoardAsset.LEAVES, l.x, l.y));

        const blocks = boarMapResponse.blocks;
        blocks.forEach(b => this.createBoardElem(BoardAsset, BoardAsset.BLOCK, b.x, b.y));
    }

    createBoardElem(assetEnum, assetEnumValue: string, x: number, y: number) {
        const stageX = (x - 1) * this.spriteSize;
        const stageY = (y - 1) * this.spriteSize;
        this.spriteService.addSprite(assetEnum, assetEnumValue, stageX, stageY, this.spriteSize, this.spriteSize);
    }
}
