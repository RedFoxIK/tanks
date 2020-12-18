import {ButtonAsset, LoaderAsset, SoundAsset} from "../model/asset";
import {SpriteService} from "./sprite.service";
import * as PIXI from 'pixi.js';
import {GameManagerService} from "./gameManager.service";

export class ViewRenderService {
    readonly screenHeight = 768;
    readonly screenWidth = 1024;
    readonly backgroundColor = 0x123E67;

    readonly spriteService: SpriteService;
    private gameManagerService: GameManagerService;

    constructor(spriteService: SpriteService, gameManagerService: GameManagerService) {
        this.spriteService = spriteService;
        this.gameManagerService = gameManagerService;
    }

    renderPreloadScene(callback: Function) {
        this.spriteService.changeContainer(new PIXI.Container());
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
            this.spriteService.makeSpriteInteractive(startBtn, true, "pointerdown", () => callback());
        }
        this.spriteService.loadAssets(onProgress, onComplete);
    }

    renderGameScene(boardModel: any) {
        this.spriteService.changeContainer(new PIXI.Container());
        this.gameManagerService.generateBoard(boardModel);
    }

    renderSuccessfulResultScene() {
        this.spriteService.changeContainer(new PIXI.Container());
        this.spriteService.addText('WIN', 280, 200, 100);
        this.spriteService.playSound(SoundAsset.WIN_SOUND);
    }

    renderUnsuccessfulResultScene() {
        this.spriteService.changeContainer(new PIXI.Container());
        this.spriteService.addText('LOOSE', 280, 200, 100);
        this.spriteService.playSound(SoundAsset.LOSE_SOUND);
    }
}