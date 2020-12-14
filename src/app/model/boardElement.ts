import {Direction} from "./direction";
import {BoardSprite} from "./spriteWrapper";
import {TankType} from "./tank";

export abstract class BoardElement {
    protected boardSprite: BoardSprite;
    readonly isDestroyable: boolean;
    readonly isBarrier: boolean;

    protected constructor(boardSprite: BoardSprite, isDestroyable: boolean, isBarrier: boolean) {
        this.boardSprite = boardSprite;
        this.isDestroyable = isDestroyable;
        this.isBarrier = isBarrier;
    }

    protected resetPosition(x: number, y: number): void {
        this.boardSprite.sprite.x = x;
        this.boardSprite.sprite.y = y;
    }

    public destroy(): void {
        if (this.isDestroyable) {
            // this.x = null;
            // this.y = null;
        }
    }

    isDestroyed(): boolean {
        // return this.x === null || this.y === null;
        return false;
    }

    getX(): number {
        return this.boardSprite.boardX;
    }

    getY(): number {
        return this.boardSprite.boardY;
    }
}

export class MovableBoardElement extends BoardElement {
    protected speed: number;
    private direction: Direction;

    constructor(boardSprite: BoardSprite, isDestroyable: boolean, speed: number) {
        super(boardSprite, isDestroyable, true);
        this.speed = speed;
        this.direction = Direction.NONE;
    }

    setDirection(direction: Direction) {
        this.direction = direction;
    }

    getDirection(): Direction {
        return this.direction;
    }

    //TODO: 2 functions
    move(check: boolean): {x: number, y: number} {
        let newX = this.boardSprite.boardX;
        let newY = this.boardSprite.boardY;
        let rotation = this.boardSprite.sprite.rotation;

        switch (this.direction) {
            case Direction.UP:
                rotation = 0;
                newY -= this.speed;
                break;
            case Direction.DOWN:
                rotation = Math.PI * 2 * 0.5;
                newY += this.speed;
                break;
            case Direction.RIGHT:
                rotation = Math.PI * 2 * 0.25;
                newX += this.speed;
                break;
            case Direction.LEFT:
                rotation = -Math.PI * 2 * 0.25;
                newX -= this.speed;
                break;
        }
        if (!check) {
            this.boardSprite.sprite.rotation = rotation;
            this.boardSprite.changeX(newX);
            this.boardSprite.changeY(newY);
        }
        return {x: newX, y: newY};
    }
}

export class Eagle extends BoardElement {
    constructor(boardSprite: BoardSprite) {
        super(boardSprite, true, true);
    }
}

export class Wall extends BoardElement {
    constructor(boardSprite: BoardSprite) {
        super(boardSprite, true, true);
    }
}

export class Block extends BoardElement {
    constructor(boardSprite: BoardSprite) {
        super(boardSprite, false, true);
    }
}

export class Water extends BoardElement {
    constructor(boardSprite: BoardSprite) {
        super(boardSprite, false, true);
    }
}

export class Leaf extends BoardElement {
    constructor(boardSprite: BoardSprite) {
        super(boardSprite, false, false);
        this.boardSprite.sprite.zIndex = 100;
    }
}

//TODO: remove string?
export enum BoardObject {
    BLOCK = "BLOCK",
    WATER = "WATER",
    LEAF = "LEAF",
    WALL = "WALL",
    EAGLE = "EAGLE",
    TANK = "TANK",
    ENEMY_TANK = "ENEMY_TANK"
}