import {Direction} from "./direction";
import {BoardSprite} from "./spriteWrapper";
import {EnumService} from "../service/enum.service";

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

    move(newPoint: Point) {
        if (newPoint != null) {
            this.boardSprite.changeX(newPoint.x);
            this.boardSprite.changeY(newPoint.y);

            if (this.direction != Direction.NONE) {
                this.boardSprite.sprite.rotation = this.direction;
            }
        }
    }

    retrieveNextMovement(): Point | null {
        let newX = this.boardSprite.boardX;
        let newY = this.boardSprite.boardY;

        switch (this.direction) {
            case Direction.UP:
                newY -= this.speed;
                break;
            case Direction.DOWN:
                newY += this.speed;
                break;
            case Direction.RIGHT:
                newX += this.speed;
                break;
            case Direction.LEFT:
                newX -= this.speed;
                break;
            case Direction.NONE:
                return null;
        }
        return new Point(newX, newY);
    }

    isElemOnBoard() {
        return this.boardSprite.boardX >= 0 && this.boardSprite.boardY >= 0 &&
            this.boardSprite.boardX < 32 && this.boardSprite.boardY < 32;
    }

    removeFromBoard() {
        this.move(new Point(-1, -1));
    }

    protected resolveDirectionByRotation(rotation: number): Direction {
        const direction = EnumService.getKey(Direction, rotation);
        return direction ? Direction[direction] : Direction.NONE;
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
        super(boardSprite, false, false, true);
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

export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}