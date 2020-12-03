import * as PIXI from "pixi.js";
import {SpriteWrapper} from "../model/spriteWrapper";
import {EnumUtilsService} from "./enum-utils.service";
import {BoardAsset, BonusAsset, ButtonAsset, SoundAsset, TankAsset} from "../model/asset";

export class SpriteService {
    readonly stage: PIXI.Container;
    readonly renderer: PIXI.Renderer;
    readonly loader: PIXI.Loader;

    private isPreloadedPhase: boolean;
    private fontFamily = 'Snippet';
    private textColor = 'white';


    private spriteWrappersMap: Map<string, SpriteWrapper> = new Map<string, SpriteWrapper>();

    constructor(app: PIXI.Application, view: HTMLElement) {
        this.isPreloadedPhase = true;

        this.stage = app.stage;
        this.loader = app.loader;
        this.renderer = app.renderer;

        view.replaceChild(app.view, view.lastElementChild);
    }

    loadAssets(onProgressFn: Function, onCompleteFn: Function) {
        EnumUtilsService.applyFunction((key, value) => this.loader.add(key, value),
            ButtonAsset, BoardAsset, BonusAsset, TankAsset, SoundAsset);

        this.loader.load();

        this.loader.onProgress.add((e) => onProgressFn(e));
        this.loader.onComplete.add(() => {
            this.isPreloadedPhase = false;
            onCompleteFn()
        });
    }

    addText(text: string, x: number, y: number, fontSize: number): SpriteWrapper {
        const stageText = new PIXI.Text(text, {fontSize: fontSize, fontFamily: this.fontFamily, fill: this.textColor});
        stageText.position.x = 280;
        stageText.position.y = 200;
        this.stage.addChild(stageText);

        const spriteWrapper =  new SpriteWrapper(stageText);
        this.spriteWrappersMap.set(spriteWrapper.id, spriteWrapper)
        return spriteWrapper;
    }

    addSprite(assetEnum: any, assetValue: string, x: number, y: number, width?: number, height?: number): SpriteWrapper {
        const spriteWrapper = this.createSprite(assetEnum, assetValue);
        spriteWrapper.sprite.x = x;
        spriteWrapper.sprite.y = y;

        if (!isNaN(width)) {
            spriteWrapper.sprite.width = width;
            spriteWrapper.sprite.height = height;
        }
        this.stage.addChild(spriteWrapper.sprite);
        return spriteWrapper;
    }

    makeSpriteInteractive(spriteWrapper: SpriteWrapper, buttonMode: boolean, event: string, callback: Function) {
        spriteWrapper.sprite.interactive = true;
        spriteWrapper.sprite.buttonMode = true;
        spriteWrapper.sprite.on(event, () => callback());
    }

    rerenderScene() {
        this.renderer.render(this.stage);
    }

    removeSprites(...spriteWrappers: SpriteWrapper[]): void {
        spriteWrappers.forEach(wrap => this.spriteWrappersMap.delete(wrap.id))
        this.stage.removeChild(...spriteWrappers.map(wrap => wrap.sprite));
    }

    clearScene(): void {
       this.stage.removeChild(...Array.from(this.spriteWrappersMap.values()).map(wrap => wrap.sprite));
       this.spriteWrappersMap.clear();
    }

    private createSprite(assetEnum: any, assetValue: string) {
        const texture = !this.isPreloadedPhase ? this.loader.resources[EnumUtilsService.getKey(assetEnum, assetValue)].texture :
            PIXI.Texture.from(assetValue);
        const spriteWrapper = new SpriteWrapper(new PIXI.Sprite(texture));
        this.spriteWrappersMap.set(spriteWrapper.id, spriteWrapper)
        return spriteWrapper;
    }
}
