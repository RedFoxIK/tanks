import {BoardElement, MovableBoardElement} from "./boardElement";
import {BoardSprite} from "./spriteWrapper";
import {Direction} from "./direction";

export class Tank extends MovableBoardElement {
    readonly startX: number;
    readonly startY: number;

    private lifeAmount: number;
    private isImmortal: boolean;

    readonly tankType: TankType;
    private bullet: Bullet | null;

    constructor(boardSprite: BoardSprite, tankType: TankType) {
        const direction = tankType === TankType.PLAYER ? Direction.UP : Direction.DOWN;
        super(boardSprite, true, 0.05, direction);

        this.startX = boardSprite.sprite.x;
        this.startY = boardSprite.sprite.y;

        this.tankType = tankType;

        this.lifeAmount = 1;
        this.isImmortal = false;

        if (tankType === TankType.ENEMY) {
            this.boardSprite.sprite.rotation = Math.PI * 2 * 0.5;
        }
    }

    createBullet(boardSprite: BoardSprite): boolean {
        if (!this.bullet) {
            this.bullet = new Bullet(boardSprite, this.getDirection());
            return true
        }
        return false;
    }

    moveBullet() {
        if (this.bullet) {
            this.bullet.move(false);
        }
    }

    explodeBullet(): void {
        this.bullet = null;
    }

    addLife(): void {
        this.lifeAmount += 1;
    }

    takeLife(): void {
        this.lifeAmount -= 1;

        if (!this.isDead()) {
            this.resetPosition(this.startX, this.startY);
        } else {
            this.destroy();
        }
    }

    takeWound(shooter: Tank): void {
        if (!this.isImmortal && this.tankType != shooter.tankType) {
            this.takeLife();
        }
    }

    isDead(): boolean {
        return this.lifeAmount <= 0;
    }

    increaseSpeed(): void {
        this.speed += 1;
    }

    decreaseSpeed(): void {
        this.speed -= 1;
    }

    makeImmortal() {
        this.isImmortal = true;
    }

    takeAwayImmortal() {
        this.isImmortal = false;
    }
}

export enum TankType {
    PLAYER, ENEMY
}

export class Bullet extends MovableBoardElement {
    constructor(boardSprite: BoardSprite, direction: Direction) {
        super(boardSprite, true, 0.15, direction);
        // this.boardSprite.sprite.width = BoardSprite.size / 2;
        // this.boardSprite.sprite.height = BoardSprite.size / 2;
    }
}