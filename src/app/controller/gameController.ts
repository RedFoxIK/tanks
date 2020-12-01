import {Game} from "../model/game";
import {StageUtilsService} from "../service/stage-utils.service";
import * as PIXI from 'pixi.js';
import {EnumUtilsService} from "../service/enum-utils.service";
import {BoardAsset, BonusAsset, ButtonAsset, LoaderAsset, SoundAsset, TankAsset} from "../model/asset";

export class GameController {
    readonly view: HTMLElement;
    private game: Game;
    private app: PIXI.Application;

    private stageUtilsService: StageUtilsService;

    constructor(view: HTMLElement) {
        this.view = view;
        this.game = new Game();
        this.app = new PIXI.Application({width: 1024, height: 768, backgroundColor : 0x123E67});
        this.stageUtilsService = new StageUtilsService(this.app.stage, this.app.renderer);
    }

    startGame() {
        this.game.changeState('LOAD');
        this.stageUtilsService.drawScene(this.app.view, this.view);

        const title =  this.stageUtilsService.addText('Tank Game', 280, 200, 100);
        const progressBg = this.stageUtilsService.addStaticSpriteFromTexture(LoaderAsset.LOADER_BG, 200, 500, 600, 80);
        const progressBar = this.stageUtilsService.addStaticSpriteFromTexture(LoaderAsset.LOADER_BAR, 205, 505, 0, 70);

        EnumUtilsService.applyFunction((key, value) => this.app.loader.add(key, value),
            ButtonAsset, BoardAsset, BonusAsset, TankAsset, SoundAsset);

        this.app.loader.load();

        this.app.loader.onProgress.add(e => {
            progressBar.width = 590 * (e.progress * 0.01);
            this.stageUtilsService.rerenderScene();
        })


        this.app.loader.onComplete.add((loader, resources) => {
            this.stageUtilsService.stage.removeChild(progressBg, progressBar);

            const btnKey =  EnumUtilsService.getKey(ButtonAsset, ButtonAsset.START);
            const button = new PIXI.Sprite(resources[btnKey].texture);
            button.x = 350;
            button.y = 450;

            button.interactive = true;
            button.buttonMode = true;

            button.on("pointerdown", () => {
                this.stageUtilsService.stage.removeChild(button, title);
            })

            this.app.stage.addChild(button);

        })
    }
}
