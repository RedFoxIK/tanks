import {Direction} from "./direction";
import {BoardSprite} from "./spriteWrapper";

export abstract class BoardElement {
    boardSprite: BoardSprite;
    readonly isDestroyable: boolean;
    readonly isBarrier: boolean;
    readonly isSkippedByBullet: boolean;
    private destroyed: boolean;

    protected constructor(boardSprite: BoardSprite, isDestroyable: boolean, isBarrier: boolean, isSkippedByBullet: boolean) {
        this.boardSprite = boardSprite;
        this.isDestroyable = isDestroyable;
        this.isBarrier = isBarrier;
        this.isSkippedByBullet = isSkippedByBullet;
        this.destroyed = true;
    }

    protected resetPosition(x: number, y: number): void {
        this.boardSprite.sprite.x = x;
        this.boardSprite.sprite.y = y;
    }

    public destroy(): void {
        if (this.isDestroyable) {
            this.destroyed = true;
        }
    }

    isDestroyed(): boolean {
        return this.destroyed;
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

    constructor(boardSprite: BoardSprite, isDestroyable: boolean, speed: number, direction: Direction) {
        super(boardSprite, isDestroyable, true, false);
        this.speed = speed;
        this.direction = direction;
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

    protected resolveDirectionByRotation(rotation: number): Direction {
        switch (rotation) {
            case 0: return Direction.UP;
            case Math.PI * 2 * 0.5: return Direction.DOWN;
            case Math.PI * 2 * 0.25: return Direction.RIGHT;
            case -Math.PI * 2 * 0.25: return Direction.LEFT;
            default: return Direction.NONE;
        }
    }
}

export class Eagle extends BoardElement {
    constructor(boardSprite: BoardSprite) {
        super(boardSprite, true, true, false);
    }
}

export class Wall extends BoardElement {
    constructor(boardSprite: BoardSprite) {
        super(boardSprite, true, true, false);
    }
}

export class Block extends BoardElement {
    constructor(boardSprite: BoardSprite) {
        super(boardSprite, false, true, false);
    }
}

export class Water extends BoardElement {
    constructor(boardSprite: BoardSprite) {
        super(boardSprite, false, true, true);
    }
}

export class Leaf extends BoardElement {
    constructor(boardSprite: BoardSprite) {
        super(boardSprite, false, false, true);
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