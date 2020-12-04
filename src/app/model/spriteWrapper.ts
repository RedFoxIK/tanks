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
    private boardX: number;
    private boardY: number;

    constructor(sprite: Sprite, x: number, y: number) {
        const stageX = BoardSprite.getSpriteCoordinate(x);
        const stageY = BoardSprite.getSpriteCoordinate(y);
        super(sprite, stageX, stageY, BoardSprite.size, BoardSprite.size);

        this.boardX = x;
        this.boardY = y;
    }

    changeX(boardX: number): void {
        this.boardX = boardX;
        this.sprite.x = BoardSprite.getSpriteCoordinate(this.boardX);
    }

    changeY(boardY: number): void {
        this.boardY = boardY;
        this.sprite.y = BoardSprite.getSpriteCoordinate(this.boardY);
    }

    static getSpriteCoordinate(coordinate: number): number {
        return (coordinate - 1) * BoardSprite.size;
    }

    static getBoardCoordinate(coordinate: number): number {
        return coordinate / BoardSprite.size + 1;
    }
}

