import {Direction} from "./direction";
import {SpriteWrapper} from "./spriteWrapper";

export abstract class BoardElement {
    protected spriteWrapper: SpriteWrapper;
    readonly isDestroyable: boolean;

    protected constructor(spriteWrapper: SpriteWrapper, isDestroyable: boolean) {
        this.spriteWrapper = spriteWrapper;
        this.isDestroyable = isDestroyable;
    }

    protected resetPosition(x: number, y: number): void {
        this.spriteWrapper.sprite.x = x;
        this.spriteWrapper.sprite.y = y;
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

    constructor(spriteWrapper: SpriteWrapper, isDestroyable: boolean, speed: number) {
        super(spriteWrapper, isDestroyable);
        this.speed = speed;
    }

    move(direction: Direction) {
        switch (direction) {
            case Direction.UP: this.spriteWrapper.sprite.y += 1; break;
            case Direction.DOWN: this.spriteWrapper.sprite.y -= 1; break;
            case Direction.RIGHT: this.spriteWrapper.sprite.x += 1; break;
            case Direction.LEFT: this.spriteWrapper.sprite.x -= 1; break;
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
    constructor(spriteWrapper: SpriteWrapper) {
        super(spriteWrapper, true);
    }
}

export class Wall extends BoardElement {
    constructor(spriteWrapper: SpriteWrapper) {
        super(spriteWrapper, true);
    }
}

export class Block extends BoardElement {
    constructor(spriteWrapper: SpriteWrapper) {
        super(spriteWrapper, false);
    }
}

export class Water extends BoardElement {
    constructor(spriteWrapper: SpriteWrapper) {
        super(spriteWrapper, false);
    }
}

export class Leaf extends BoardElement {
    constructor(spriteWrapper: SpriteWrapper) {
        super(spriteWrapper, false);
    }
}

export enum BoardObject {
    BLOCK = "BLOCK",
    WATER = "WATER",
    LEAF = "LEAF",
    WALL = "WALL",
    EAGLE = "EAGLE",
}