import * as PIXI from "pixi.js";
import {EnumUtilsService} from "./enum-utils.service";
import {BoardAsset, BonusAsset, ButtonAsset, SoundAsset, TankAsset} from "../model/asset";
import {SpriteWrapper} from "../model/spriteWrapper";

export class LoaderUtilsService {
    readonly loader: PIXI.Loader;

    constructor(loader: PIXI.Loader) {
        this.loader = loader;
    }

    loadStartAssets(onProgressFn: Function, onCompleteFn: Function) {
        EnumUtilsService.applyFunction((key, value) => this.loader.add(key, value),
            ButtonAsset, BoardAsset, BonusAsset, TankAsset, SoundAsset);

        this.loader.load();

        this.loader.onProgress.add((e) => onProgressFn(e));
        this.loader.onComplete.add(() => onCompleteFn());
    }

    createSpriteFromTexture(pathToImg: string): SpriteWrapper {
        return new SpriteWrapper(new PIXI.Sprite(PIXI.Texture.from(pathToImg)));
    }

    createSpriteFromLoadedTexture(assetEnum: any, assetValue: string) {
        const key = EnumUtilsService.getKey(assetEnum, assetValue);
        return new SpriteWrapper(new PIXI.Sprite(this.loader.resources[key].texture));
    }
}
