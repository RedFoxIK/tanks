import {Sprite} from "pixi.js";
import { v4 as uuid } from 'uuid';

export class SpriteWrapper {
    readonly id: string;
    readonly sprite: Sprite;

    constructor(sprite: Sprite) {
        this.id = uuid();
        this.sprite = sprite;
    }
}
