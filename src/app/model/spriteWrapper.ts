import {Sprite} from "pixi.js";
import {v4 as uuid} from 'uuid';

export class SpriteWrapper {
    readonly id: string;
    readonly sprite: Sprite;

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


    changeWidth(width: number) {
        this.sprite.width = width;
    }
}

export class BoardSprite extends SpriteWrapper {
    static size = 24;
    boardX: number;
    boardY: number;
    rotatable: boolean
    scale: number;

    constructor(sprite: Sprite, x: number, y: number, rotatable?: boolean, scale: number = 1) {
        const stageX = BoardSprite.getSpriteCoordinate(x, scale, rotatable);
        const stageY = BoardSprite.getSpriteCoordinate(y, scale, rotatable);

        console.log(stageX + ' -- ' + stageY);

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

    changeX(boardX: number): void {
        this.boardX = boardX;
        this.sprite.x = BoardSprite.getSpriteCoordinate(this.boardX, this.scale, this.rotatable);
    }

    changeY(boardY: number): void {
        this.boardY = boardY;
        this.sprite.y = BoardSprite.getSpriteCoordinate(this.boardY, this.scale, this.rotatable);
    }

    static getSpriteCoordinate(coordinate: number, scale: number, rotatable?: boolean): number {
        const corrector = rotatable ?  BoardSprite.size / 2 : 0;
        const shift = (1 - scale) * BoardSprite.size / 2;
        return coordinate * BoardSprite.size + corrector + shift;
    }

    static getBoardCoordinate(coordinate: number, rotatable?: boolean): number {
        const corrector = rotatable ?  BoardSprite.size / 2 : 0;
        return (coordinate - corrector) / BoardSprite.size;
    }
}

