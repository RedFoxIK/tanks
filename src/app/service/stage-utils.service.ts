import * as PIXI from "pixi.js";
import {SpriteWrapper} from "../model/spriteWrapper";

export class StageUtilsService {
    private fontFamily = 'Snippet';
    private textColor = 'white';

    readonly stage: PIXI.Container;
    readonly renderer: PIXI.Renderer;

    private spriteWrappersMap: Map<string, SpriteWrapper> = new Map<string, SpriteWrapper>();

    constructor(stage: PIXI.Container, renderer: PIXI.Renderer) {
        this.renderer = renderer;
        this.stage = stage;
    }

    drawScene(canvas: HTMLCanvasElement, view: HTMLElement) {
        view.replaceChild(canvas, view.lastElementChild);
    }

    addText(text: string, x: number, y: number, fontSize: number): SpriteWrapper {
        const stageText = new PIXI.Text(text, {fontSize: fontSize, fontFamily: this.fontFamily, fill: this.textColor});
        stageText.position.x = 280;
        stageText.position.y = 200;
        this.stage.addChild(stageText);
        return new SpriteWrapper(stageText);
    }

    addSprite(spriteWrapper: SpriteWrapper, x: number, y: number, width?: number, height?: number) {
        this.spriteWrappersMap.set(spriteWrapper.id, spriteWrapper)

        spriteWrapper.sprite.x = x;
        spriteWrapper.sprite.y = y;

        if (!isNaN(width)) {
            spriteWrapper.sprite.width = width;
            spriteWrapper.sprite.height = height;
        }
        this.stage.addChild(spriteWrapper.sprite);
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
}
