import * as PIXI from "pixi.js";
import {Sprite, Text} from "pixi.js";
import {Asset} from "../model/asset";

export class StageUtilsService {
    private fontFamily = 'Snippet';
    private textColor = 'white';

    readonly stage: PIXI.Container;
    readonly renderer: PIXI.Renderer;

    constructor(stage: PIXI.Container, renderer: PIXI.Renderer) {
        this.renderer = renderer;
        this.stage = stage;
    }

    drawScene(canvas: HTMLCanvasElement, view: HTMLElement) {
        view.replaceChild(canvas, view.lastElementChild);
    }

    addText(text: string, x: number, y: number, fontSize: number): Text {
        const stageText = new PIXI.Text(text, {fontSize: fontSize, fontFamily: this.fontFamily, fill: this.textColor});
        stageText.position.x = 280;
        stageText.position.y = 200;
        this.stage.addChild(stageText);
        return stageText;
    }

    addStaticSpriteFromTexture(pathToImg: string, x: number, y: number, width?: number, height?: number): Sprite {
        const sprite = new PIXI.Sprite(PIXI.Texture.from(pathToImg));
        sprite.x = x;
        sprite.y = y;
        sprite.width = width;
        sprite.height = height;
        this.stage.addChild(sprite);
        return sprite;
    }

    addInteractiveSprite(assetEnum: Asset, assetValue: string, x: number, y: number, interactive: boolean) {
        // const btnKey =  EnumUtilsService.getKey(ButtonAsset, ButtonAsset.START);
        // const button = new PIXI.Sprite(resources[btnKey].texture);
        // button.x = 350;
        // button.y = 450;
        //
        // button.interactive = true;
    }

    rerenderScene() {
        this.renderer.render(this.stage);
    }

    removeSprites(...sprites: any): void {
        this.stage.removeChild(sprites);
    }

    // removeSprites(...children: Sprite[]) {
    //     this.stage.removeChild(children);
    // }
}
