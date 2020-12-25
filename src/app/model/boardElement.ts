import {EnumService} from "../service/enum.service";
import {Direction} from "./direction";
import {BoardSprite} from "./spriteWrapper";

export abstract class BoardElement {
    public boardSprite: BoardSprite;
    public readonly isDestroyable: boolean;
    public readonly isBarrier: boolean;
    public readonly isSkippedByBullet: boolean;
    private destroyed: boolean;

    protected constructor(boardSprite: BoardSprite, isDestroyable: boolean, isBarrier: boolean,
                          isSkippedByBullet: boolean) {
        this.boardSprite = boardSprite;
        this.isDestroyable = isDestroyable;
        this.isBarrier = isBarrier;
        this.isSkippedByBullet = isSkippedByBullet;
        this.destroyed = true;
    }

    public destroy(): void {
        if (this.isDestroyable) {
            this.destroyed = true;
        }
    }

    public isDestroyed(): boolean {
        return this.destroyed;
    }

    public getX(): number {
        return this.boardSprite.boardX;
    }

    public getY(): number {
        return this.boardSprite.boardY;
    }

    protected resetPosition(x: number, y: number): void {
        this.boardSprite.sprite.x = x;
        this.boardSprite.sprite.y = y;
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

    public setDirection(direction: Direction) {
        this.direction = direction;
    }

    public getDirection(): Direction {
        return this.direction;
    }

    public move(newPoint: Point) {
        if (newPoint != null) {
            this.boardSprite.changePosition(newPoint);

            if (this.direction !== Direction.NONE) {
                this.boardSprite.sprite.rotation = this.direction;
            }
        }
    }

    public retrieveNextMovement(direction?: Direction): Point | null {
        let newX = this.boardSprite.boardX;
        let newY = this.boardSprite.boardY;
        const currentDirection = direction || this.direction;

        switch (currentDirection) {
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

    public isElemOnBoard() {
        return this.boardSprite.boardX >= 0 && this.boardSprite.boardY >= 0 &&
            this.boardSprite.boardX < 32 && this.boardSprite.boardY < 32;
    }

    public removeFromBoard() {
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

export enum BoardObject {
    BLOCK = "BLOCK",
    WATER = "WATER",
    LEAF = "LEAF",
    WALL = "WALL",
    EAGLE = "EAGLE",
    TANK = "TANK",
    ENEMY_TANK = "ENEMY_TANK",
}

export class Point {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
