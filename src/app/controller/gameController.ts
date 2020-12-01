import {Game} from "../model/game";
import {StageUtilsService} from "../service/stage-utils.service";
import * as PIXI from 'pixi.js';
import {ButtonAsset, LoaderAsset} from "../model/asset";
import {LoaderUtilsService} from "../service/loader-utils.service";

export class GameController {
    readonly view: HTMLElement;
    private game: Game;
    private app: PIXI.Application;

    private stageUtilsService: StageUtilsService;
    private loaderService: LoaderUtilsService;

    constructor(view: HTMLElement) {
        this.view = view;
        this.game = new Game();
        this.app = new PIXI.Application({width: 1024, height: 768, backgroundColor: 0x123E67});
        this.stageUtilsService = new StageUtilsService(this.app.stage, this.app.renderer);
        this.loaderService = new LoaderUtilsService(this.app.loader);
    }

    startGame() {
        this.game.changeState('LOAD');
        this.stageUtilsService.drawScene(this.app.view, this.view);

        const title = this.stageUtilsService.addText('Tank Game', 280, 200, 100);

        const progressBg = this.loaderService.createSpriteFromTexture(LoaderAsset.LOADER_BG);
        this.stageUtilsService.addSprite(progressBg, 200, 500, 600, 80);

        const progressBar = this.loaderService.createSpriteFromTexture(LoaderAsset.LOADER_BAR);
        this.stageUtilsService.addSprite(progressBar, 205, 505, 0, 70);

        const onProgress = e => {
            progressBar.width = 590 * (e.progress * 0.01);
            this.stageUtilsService.rerenderScene();
        };

        const onComplete = () => {
            this.stageUtilsService.stage.removeChild(progressBg, progressBar);
            const startBtn = this.loaderService.createSpriteFromLoadedTexture(ButtonAsset, ButtonAsset.START);
            this.stageUtilsService.addSprite(startBtn, 350, 450);
            this.stageUtilsService.makeSpriteInteractive(startBtn, true,
                "pointerdown", () => this.stageUtilsService.stage.removeChild(startBtn, title));
        }
        this.loaderService.loadStartAssets(onProgress, onComplete);
    }
}
