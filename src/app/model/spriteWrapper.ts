import {Sprite} from "pixi.js";
import { v4 as uuid } from 'uuid';

export class SpriteWrapper {
    readonly id: string;
    //TODO: make protected
    readonly sprite: Sprite;

    constructor(sprite: Sprite) {
        this.id = uuid();
        this.sprite = sprite;
    }

    changeWidth(width: number) {
        this.sprite.width = width;
    }
}

export class BoardSprite extends SpriteWrapper {
    static size = 24;
    private boardX: number;
    private boardY: number;

    constructor(sprite: Sprite) {
        super(sprite);

        this.boardX = BoardSprite.getBoardCoordinate(sprite.x);
        this.boardY = BoardSprite.getBoardCoordinate(sprite.y);
    }

    changeX(boardX: number): void {
        this.boardX = boardX;
        this.sprite.x =  BoardSprite.getSpriteCoordinate(this.boardX);
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

