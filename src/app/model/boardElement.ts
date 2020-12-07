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
        this.boardSprite.sprite.anchor.set(0.5);
    }

    move(direction: Direction) {
        switch (direction) {
            case Direction.UP:
                this.boardSprite.sprite.rotation = 0;
                this.boardSprite.changeY(this.boardSprite.boardY - 0.05);
                break;
            case Direction.DOWN:
                this.boardSprite.sprite.rotation = Math.PI * 2 * 0.5;
                this.boardSprite.changeY(this.boardSprite.boardY + 0.05);
                break;
            case Direction.RIGHT:
                this.boardSprite.sprite.rotation = Math.PI * 2 * 0.25;
                this.boardSprite.changeX(this.boardSprite.boardX + 0.05);

                break;
            case Direction.LEFT:
                this.boardSprite.sprite.rotation = -Math.PI * 2 * 0.25;
                this.boardSprite.changeX(this.boardSprite.boardX - 0.05);
                break;
        }
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