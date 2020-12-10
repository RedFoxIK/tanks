import * as PIXI from "pixi.js";
import {BoardSprite, SpriteWrapper} from "../model/spriteWrapper";
import {EnumUtilsService} from "./enum-utils.service";
import {BoardAsset, BonusAsset, ButtonAsset, SoundAsset, TankAsset} from "../model/asset";
import {Sprite} from "pixi.js";

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

        this.loader.add('EXPLODE_ANIM', 'assets/images/animations/explode.json')
        this.loader.add('EXPLODE_SMALL_ANIM', 'assets/images/animations/small_explode.json')
        this.loader.add('APPEAR_ANIM', 'assets/images/animations/appear.json')
        this.loader.load();


        this.loader.onProgress.add((e) => onProgressFn(e));
        this.loader.onComplete.add(() => {
            this.isPreloadedPhase = false;
            onCompleteFn()
        });
    }

    addText(text: string, x: number, y: number, fontSize: number): SpriteWrapper {
        const stageText = new PIXI.Text(text, {fontSize: fontSize, fontFamily: this.fontFamily, fill: this.textColor});
        this.stage.addChild(stageText);

        const spriteWrapper = new SpriteWrapper(stageText, x, y);
        this.spriteWrappersMap.set(spriteWrapper.id, spriteWrapper)
        return spriteWrapper;
    }

    createBoardElem(assetEnum: any, assetValue: string, x: number, y: number, rotatable?: boolean): BoardSprite {
        const sprite = this.createSprite(assetEnum, assetValue);
        const boardSprite = new BoardSprite(sprite, x, y, rotatable);
        this.addSpriteToBoard(boardSprite);
        return boardSprite;
    }

    addSprite(assetEnum: any, assetValue: string, x: number, y: number, width?: number, height?: number): SpriteWrapper {
        const sprite = this.createSprite(assetEnum, assetValue);
        const spriteWrapper = new SpriteWrapper(sprite, x, y, width, height);
        this.addSpriteToBoard(spriteWrapper);
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

    private createSprite(assetEnum: any, assetValue: string): Sprite {
        const texture = !this.isPreloadedPhase ? this.loader.resources[EnumUtilsService.getKey(assetEnum, assetValue)].texture :
            PIXI.Texture.from(assetValue);
        return new PIXI.Sprite(texture);
    }

    private addSpriteToBoard(spriteWrapper: SpriteWrapper) {
        this.stage.addChild(spriteWrapper.sprite);
        this.spriteWrappersMap.set(spriteWrapper.id, spriteWrapper)
    }
}
