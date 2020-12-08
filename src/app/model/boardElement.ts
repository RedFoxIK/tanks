import {Direction} from "./direction";
import {BoardSprite} from "./spriteWrapper";

export abstract class BoardElement {
    protected boardSprite: BoardSprite;
    readonly isDestroyable: boolean;

    protected constructor(boardSprite: BoardSprite, isDestroyable: boolean) {
        this.boardSprite = boardSprite;
        this.isDestroyable = isDestroyable;
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
}

export class MovableBoardElement extends BoardElement {
    protected speed: number;

    constructor(boardSprite: BoardSprite, isDestroyable: boolean, speed: number) {
        super(boardSprite, isDestroyable);
        this.speed = speed;
    }

    //TODO: 2 functions
    move(direction: Direction, check: boolean): {x: number, y: number} {
        let newX = this.boardSprite.boardX;
        let newY = this.boardSprite.boardY;
        let rotation = this.boardSprite.sprite.rotation;

        switch (direction) {
            case Direction.UP:
                rotation = 0;
                newY -= 0.05;
                break;
            case Direction.DOWN:
                rotation = Math.PI * 2 * 0.5;
                newY += 0.05;
                break;
            case Direction.RIGHT:
                rotation = Math.PI * 2 * 0.25;
                newX += 0.05;
                break;
            case Direction.LEFT:
                rotation = -Math.PI * 2 * 0.25;
                newX -= 0.05;
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

// export class Bullet extends MovableBoardElement {
//
//     constructor(x: number, y: number) {
//         super(x, y, true, 4);
//     }
// }

export class Eagle extends BoardElement {
    constructor(boardSprite: BoardSprite) {
        super(boardSprite, true);
    }
}

export class Wall extends BoardElement {
    constructor(boardSprite: BoardSprite) {
        super(boardSprite, true);
    }
}

export class Block extends BoardElement {
    constructor(boardSprite: BoardSprite) {
        super(boardSprite, false);
    }
}

export class Water extends BoardElement {
    constructor(boardSprite: BoardSprite) {
        super(boardSprite, false);
    }
}

export class Leaf extends BoardElement {
    constructor(boardSprite: BoardSprite) {
        super(boardSprite, false);
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