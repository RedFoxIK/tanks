import * as PIXI from "pixi.js";
import { default as PIXI_SOUND } from 'pixi-sound';
import {BoardSprite, SpriteWrapper} from "../model/spriteWrapper";
import {EnumUtilsService} from "./enum-utils.service";
import {AnimationAsset, BoardAsset, BonusAsset, ButtonAsset, SoundAsset, TankAsset} from "../model/asset";
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
            ButtonAsset, BoardAsset, BonusAsset, TankAsset, AnimationAsset);
        this.loader.load();

        this.loader.onProgress.add((e) => onProgressFn(e));
        this.loader.onComplete.add(() => {
            this.isPreloadedPhase = false;
            onCompleteFn()
        });

        EnumUtilsService.applyFunction((key, value) => PIXI_SOUND.add(key, value),
            SoundAsset);
    }

    addText(text: string, x: number, y: number, fontSize: number): SpriteWrapper {
        const stageText = new PIXI.Text(text, {fontSize: fontSize, fontFamily: this.fontFamily, fill: this.textColor});
        this.stage.addChild(stageText);
        const spriteWrapper = new SpriteWrapper(stageText, x, y);
        this.spriteWrappersMap.set(spriteWrapper.id, spriteWrapper)
        return spriteWrapper;
    }

    createBoardElem(assetEnum: any, assetValue: string, x: number, y: number, scale?: number, rotatable?: boolean, animation?: boolean): BoardSprite {
        const sprite = this.createSprite(assetEnum, assetValue);
        const boardSprite = new BoardSprite(sprite, x, y, rotatable, scale);

        !animation ? this.addSpriteToBoard(boardSprite) :
            this.playAnimation(AnimationAsset.APPEAR, boardSprite.sprite.x, boardSprite.sprite.y,  () => this.addSpriteToBoard(boardSprite));

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
        const aboveElemIndexes = [];
        this.stage.children.forEach((e, i) => {
            if (e.zIndex > 0) {
                aboveElemIndexes.push(i);
            }
        })

        const reservedForAboveFirstInx = this.stage.children.length - aboveElemIndexes.length;
        const aboveElemInxWillBeSwapped = aboveElemIndexes.filter(val => val < reservedForAboveFirstInx);
        if (aboveElemInxWillBeSwapped.length > 0) {
            const bottomElemInxWillBeSwapped = [];
            for (let i = reservedForAboveFirstInx; i < this.stage.children.length; i++) {
                if (this.stage.children[i].zIndex == 0) {
                    bottomElemInxWillBeSwapped.push(i);
                }
            }
            for (let i = 0; i < aboveElemInxWillBeSwapped.length; i++) {
                let temp = this.stage.children[aboveElemInxWillBeSwapped[i]];
                this.stage.children[aboveElemInxWillBeSwapped[i]] = this.stage.children[bottomElemInxWillBeSwapped[i]];
                this.stage.children[bottomElemInxWillBeSwapped[i]] = temp;
            }
        }
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

    playSound(soundAssetValue: string) {
        PIXI_SOUND.play(EnumUtilsService.getKey(SoundAsset, soundAssetValue));
    }

    playAnimation(animAssetValue: string, x: number, y: number, oncomplete?: Function) {
        const animationKey = EnumUtilsService.getKey(AnimationAsset, animAssetValue);
        const animation = new PIXI.AnimatedSprite(this.loader.resources[animationKey].spritesheet.animations['animation']);

        const spriteWrapper = new BoardSprite(animation, x, y, true, 2);
        this.addSpriteToBoard(spriteWrapper);

        animation.loop = false;
        animation.animationSpeed = 0.2;
        animation.onComplete = () => {
            this.removeSprites(spriteWrapper);
            if (oncomplete) {
                oncomplete();
            }
        }
        animation.play();
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
