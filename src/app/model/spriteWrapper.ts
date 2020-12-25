import {Sprite} from "pixi.js";
import {v4 as uuid} from "uuid";

export class SpriteWrapper {
    public readonly id: string;
    public readonly sprite: Sprite;

    constructor(sprite: Sprite, x: number, y: number, width?: number, height?: number) {
        this.id = uuid();
        this.sprite = sprite;
        this.sprite.x = x;
        this.sprite.y = y;

        if (!isNaN(height)) {
            this.sprite.width = width;
            this.sprite.height = height;
        }
    }

    public changeWidth(width: number) {
        this.sprite.width = width;
    }
}

export class BoardSprite extends SpriteWrapper {
    public static size = 24;

    public static getSpriteCoordinate(coordinate: number, rotatable?: boolean): number {
        const corrector = rotatable ? BoardSprite.size / 2 : 0;
        const shift = 0;
        return coordinate * BoardSprite.size + corrector + shift;
    }

    public static getBoardCoordinate(coordinate: number, rotatable?: boolean): number {
        const corrector = rotatable ? BoardSprite.size / 2 : 0;
        return (coordinate - corrector) / BoardSprite.size;
    }
    public boardX: number;
    public boardY: number;
    public rotatable: boolean;
    public scale: number;

    constructor(sprite: Sprite, x: number, y: number, rotatable?: boolean, scale: number = 1) {
        const stageX = BoardSprite.getSpriteCoordinate(x, rotatable);
        const stageY = BoardSprite.getSpriteCoordinate(y, rotatable);

        const size = scale * BoardSprite.size;
        super(sprite, stageX, stageY, size, size);

        this.boardX = x;
        this.boardY = y;
        this.rotatable = rotatable;
        this.scale = scale;

        if (rotatable) {
            this.sprite.anchor.set(0.5);
        }
    }

    public changeX(boardX: number): void {
        this.boardX = boardX;
        this.sprite.x = BoardSprite.getSpriteCoordinate(this.boardX, this.rotatable);
    }

    public changeY(boardY: number): void {
        this.boardY = boardY;
        this.sprite.y = BoardSprite.getSpriteCoordinate(this.boardY, this.rotatable);
    }
}
