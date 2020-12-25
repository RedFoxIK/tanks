import { default as PIXI_SOUND } from "pixi-sound";
import * as PIXI from "pixi.js";
import {Sprite} from "pixi.js";
import {AnimationAsset, BoardAsset, BonusAsset, ButtonAsset, SoundAsset, TankAsset} from "../model/asset";
import {BoardSprite, SpriteWrapper} from "../model/spriteWrapper";
import {EnumService} from "./enum.service";

export class SpriteService {
    public readonly ticker: PIXI.Ticker;
    private readonly stage: PIXI.Container;
    private readonly renderer: PIXI.Renderer;
    private readonly loader: PIXI.Loader;

    private isPreloadedPhase = true;
    private fontFamily = "Snippet";
    private textColor = "white";

    private readonly SCREEN_HEIGHT = 768;
    private readonly SCREEN_WIDTH = 1024;
    private readonly BACKGROUND_COLOR = 0x123E67;

    private container: PIXI.Container;

    private spriteWrappersMap: Map<string, SpriteWrapper> = new Map<string, SpriteWrapper>();

    constructor(view: HTMLElement) {
        const app = new PIXI.Application({
            backgroundColor: this.BACKGROUND_COLOR,
            height: this.SCREEN_HEIGHT,
            width: this.SCREEN_WIDTH,
        });

        this.stage = app.stage;
        this.loader = app.loader;
        this.renderer = app.renderer;
        this.ticker = app.ticker;

        view.replaceChild(app.view, view.lastElementChild);
    }

    public changeContainer(container: PIXI.Container) {
        if (this.container) {
            this.container.destroy();
        }
        this.container = container;
        this.stage.addChild(container);
    }

    public loadAssets(onProgressFn: Function, onCompleteFn: Function) {
        EnumService.applyFunction((key, value) => this.loader.add(key, value),
            ButtonAsset, BoardAsset, BonusAsset, TankAsset, AnimationAsset);
        this.loader.load();

        this.loader.onProgress.add((e) => onProgressFn(e));
        this.loader.onComplete.add(() => {
            this.isPreloadedPhase = false;
            onCompleteFn();
        });

        EnumService.applyFunction((key, value) => PIXI_SOUND.add(key, value),
            SoundAsset);
    }

    public addText(text: string, x: number, y: number, fontSize: number, color?: string): SpriteWrapper {
        const textColor = color || this.textColor;
        const stageText = new PIXI.Text(text, {fontSize, fontFamily: this.fontFamily, fill: textColor});
        this.container.addChild(stageText);
        const spriteWrapper = new SpriteWrapper(stageText, x, y);
        this.spriteWrappersMap.set(spriteWrapper.id, spriteWrapper);
        return spriteWrapper;
    }

    public createBoardElem(assetEnum: any, assetValue: string, x: number, y: number, scale?: number,
                           rotatable?: boolean): BoardSprite {

        const sprite = this.createSprite(assetEnum, assetValue);
        const boardSprite = new BoardSprite(sprite, x, y, rotatable, scale);
        this.addSpriteToBoard(boardSprite);
        return boardSprite;
    }

    public addSprite(assetEnum: any, assetValue: string, x: number, y: number, width?: number,
                     height?: number): SpriteWrapper {
        const sprite = this.createSprite(assetEnum, assetValue);
        const spriteWrapper = new SpriteWrapper(sprite, x, y, width, height);
        this.addSpriteToBoard(spriteWrapper);
        return spriteWrapper;
    }

    public makeSpriteInteractive(spriteWrapper: SpriteWrapper, buttonMode: boolean, event: string, callback: Function) {
        spriteWrapper.sprite.interactive = true;
        spriteWrapper.sprite.buttonMode = true;
        spriteWrapper.sprite.on(event, () => callback());
    }

    public rerenderScene() {
        const aboveElemIndexes = [];
        this.container.children.forEach((e, i) => {
            if (e.zIndex > 0) {
                aboveElemIndexes.push(i);
            }
        });

        const reservedForAboveFirstInx = this.container.children.length - aboveElemIndexes.length;
        const aboveElemInxWillBeSwapped = aboveElemIndexes.filter((val) => val < reservedForAboveFirstInx);
        if (aboveElemInxWillBeSwapped.length > 0) {
            const bottomElemInxWillBeSwapped = [];
            for (let i = reservedForAboveFirstInx; i < this.container.children.length; i++) {
                if (this.container.children[i].zIndex === 0) {
                    bottomElemInxWillBeSwapped.push(i);
                }
            }
            for (let i = 0; i < aboveElemInxWillBeSwapped.length; i++) {
                const temp = this.container.children[aboveElemInxWillBeSwapped[i]];
                this.container.children[aboveElemInxWillBeSwapped[i]] =
                    this.container.children[bottomElemInxWillBeSwapped[i]];
                this.container.children[bottomElemInxWillBeSwapped[i]] = temp;
            }
            this.renderer.render(this.container);
        }
    }

    public removeSprites(...spriteWrappers: SpriteWrapper[]): void {
        spriteWrappers.forEach((wrap) => this.spriteWrappersMap.delete(wrap.id));
        this.container.removeChild(...spriteWrappers.map((wrap) => wrap.sprite));
    }

    public clearScene(): void {
       this.container.removeChild(...Array.from(this.spriteWrappersMap.values()).map((wrap) => wrap.sprite));
       this.spriteWrappersMap.clear();
    }

    public playSound(soundAssetValue: string) {
        PIXI_SOUND.play(EnumService.getKey(SoundAsset, soundAssetValue));
    }

    public playAnimation(animAssetValue: string, x: number, y: number, oncomplete?: Function) {
        const animationKey = EnumService.getKey(AnimationAsset, animAssetValue);
        const animation = new PIXI.AnimatedSprite(
            this.loader.resources[animationKey].spritesheet.animations.animation);

        const spriteWrapper = new BoardSprite(animation, x, y, true, 3);
        this.addSpriteToBoard(spriteWrapper);

        animation.loop = false;
        animation.animationSpeed = 0.2;
        animation.onComplete = () => {
            this.removeSprites(spriteWrapper);
            if (oncomplete) {
                oncomplete();
            }
        };
        animation.play();
    }

    private createSprite(assetEnum: any, assetValue: string): Sprite {
        const texture = !this.isPreloadedPhase ?
            this.loader.resources[EnumService.getKey(assetEnum, assetValue)].texture : PIXI.Texture.from(assetValue);
        return new PIXI.Sprite(texture);
    }

    private addSpriteToBoard(spriteWrapper: SpriteWrapper) {
        this.container.addChild(spriteWrapper.sprite);
        this.spriteWrappersMap.set(spriteWrapper.id, spriteWrapper);
    }
}
