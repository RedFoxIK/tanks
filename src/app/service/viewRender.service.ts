import * as PIXI from "pixi.js";
import {ButtonAsset, LoaderAsset, SoundAsset} from "../model/asset";
import {AssetService} from "./asset.service";

export class ViewRenderService {
    public readonly spriteService: AssetService;

    constructor(spriteService: AssetService) {
        this.spriteService = spriteService;
    }

    public renderPreloadScene(callback: () => void) {
        this.spriteService.changeContainer(new PIXI.Container());
        this.spriteService.addText("Tank Game", 280, 200, 100);

        const progressBg = this.spriteService.addSprite(LoaderAsset, LoaderAsset.LOADER_BG, 200, 500, 600, 80);
        const progressBar = this.spriteService.addSprite(LoaderAsset, LoaderAsset.LOADER_BAR, 205, 505, 0, 70);

        const onProgress = (e) => {
            progressBar.changeWidth(590 * (e.progress * 0.01));
            this.spriteService.rerenderScene();
        };

        const onComplete = () => {
            this.spriteService.removeSprites(progressBg, progressBar);
            const startBtn = this.spriteService.addSprite(ButtonAsset, ButtonAsset.START, 350, 450);
            this.spriteService.makeSpriteInteractive(startBtn, true, "pointerdown", () => callback());
        };
        this.spriteService.loadAssets(onProgress, onComplete);
    }

    public renderGameScene() {
        this.spriteService.changeContainer(new PIXI.Container());
    }

    public renderSuccessfulResultScene(scores: number) {
        this.spriteService.changeContainer(new PIXI.Container());
        this.spriteService.addText("WIN!!!", 320, 200, 100);
        this.spriteService.addText("SCORES: " + scores, 350, 500, 50, "yellow");
        this.spriteService.playSound(SoundAsset.WIN_SOUND);
    }

    public renderUnsuccessfulResultScene(scores: number) {
        this.spriteService.changeContainer(new PIXI.Container());
        this.spriteService.addText("LOOSE", 320, 200, 100);
        this.spriteService.addText("SCORES: " + scores, 350, 500, 50, "red");
        this.spriteService.playSound(SoundAsset.LOSE_SOUND);
    }
}
