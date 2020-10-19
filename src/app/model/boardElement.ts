import {Direction} from "./direction";
import {Image} from "./image";

export abstract class BoardElement {
    protected x: number;
    protected y: number;
    readonly isDestroyable: boolean;
    readonly image: Image;

    protected constructor(image: Image, x: number, y: number, isDestroyable: boolean) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.isDestroyable = isDestroyable;
    }

    protected resetPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    public destroy(): void {
        if (this.isDestroyable) {
            // this.x = null;
            // this.y = null;
        }
    }

    isDestroyed(): boolean {
        return this.x === null || this.y === null;
    }
}

export class MovableBoardElement extends BoardElement {
    protected speed: number;

    constructor(image: Image, x: number, y: number, isDestroyable: boolean, speed: number) {
        super(image, x, y, isDestroyable);
        this.speed = speed;
    }

    move(direction: Direction) {
        switch (direction) {
            case Direction.UP: this.y += 1; break;
            case Direction.DOWN: this.y -= 1; break;
            case Direction.RIGHT: this.x += 1; break;
            case Direction.LEFT: this.x -= 1; break;
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
    constructor(x: number, y: number) {
        super(Image.EAGLE, x, y, true);
    }
}

export class Wall extends BoardElement {
    constructor(image: Image, x: number, y: number) {
        super(image, x, y, true);
    }
}

export class Block extends BoardElement {
    constructor(x: number, y: number) {
        super(Image.BLOCK, x, y, false);
    }
}

export class Water extends BoardElement {
    constructor(x: number, y: number) {
        super(Image.WATER, x, y, false);
    }
}

export class Leaf extends BoardElement {
    constructor(x: number, y: number) {
        super(Image.LEAVES, x, y, false);
    }
}
