import {SpriteService} from "./sprite.service";
import {BoardAsset, ButtonAsset, LoaderAsset} from "../model/asset";
import PIXI from "pixi.js";

export class BoardGeneratorService {
    readonly boardSize = 32;
    readonly spriteSize = 24;

    private spriteService: SpriteService;
    private view: HTMLElement;

    constructor(app: PIXI.Application, view: HTMLElement) {
        this.view = view;
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
                    this.generateBoard();
                });
        }

        this.spriteService.loadAssets(onProgress, onComplete);
    }

    public generateBoard() {
        for (let i = 0; i < 32; i++) {
            this.spriteService.addSprite(BoardAsset, BoardAsset.BLOCK, 0, i * 24, 24, 24);
            this.spriteService.addSprite(BoardAsset, BoardAsset.BLOCK, 744, i * 24, 24, 24);
            this.spriteService.addSprite(BoardAsset, BoardAsset.BLOCK, i * 24, 0, 24, 24);
            this.spriteService.addSprite(BoardAsset, BoardAsset.BLOCK,  i * 24, 744, 24, 24);
        }
    }
}
