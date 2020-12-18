import {MovableBoardElement} from "./boardElement";
import {BoardSprite} from "./spriteWrapper";
import {Direction} from "./direction";

export class Tank extends MovableBoardElement {
    static initialSpeed = 0.05;
    readonly startX: number;
    readonly startY: number;

    private lifeAmount: number;
    private isImmortal: boolean;

    readonly tankType: TankType;
    private bullet: Bullet | null;

    constructor(boardSprite: BoardSprite, tankType: TankType) {
        const direction = Direction.NONE;
        super(boardSprite, true, Tank.initialSpeed, direction);

        this.startX = boardSprite.boardX;
        this.startY = boardSprite.boardY;

        this.tankType = tankType;

        this.lifeAmount = 1;
        this.isImmortal = false;

        if (tankType === TankType.ENEMY) {
            this.boardSprite.sprite.rotation = Math.PI * 2 * 0.5;
        }
    }

    setInitialSpeed() {
        this.speed = Tank.initialSpeed;
    }

    createBullet(boardSprite: BoardSprite): boolean {
        if (!this.bullet) {
            const bulletDirection = this.getDirection() !== Direction.NONE ? this.getDirection() :
                this.resolveDirectionByRotation(this.boardSprite.sprite.rotation);

            this.bullet = new Bullet(boardSprite, bulletDirection);
            return true
        }
        return false;
    }

    moveBullet(): {x: number, y: number} {
        if (this.bullet) {
            return this.bullet.move(false);
        }
    }

    getBulletDirection() {
        return this.bullet ? this.bullet.getDirection() : Direction.NONE;
    }

    explodeBullet(): void {
        this.bullet = null;
    }

    getBullet() {
        return this.bullet;
    }

    addLife(): void {
        this.lifeAmount += 1;
    }

    takeLife(): void {
        this.lifeAmount -= 1;
    }

    takeWound(shooter: Tank): void {
        if (!this.isImmortal && this.tankType != shooter.tankType) {
            this.takeLife();
        }
    }

    isDead(): boolean {
        return this.lifeAmount <= 0;
    }

    increaseSpeed(speed: number): void {
        this.speed += speed;
        if (this.speed > 0.1) {
            this.speed = 0.1;
        }

        console.log('speed  = ' + this.speed);
    }

    decreaseSpeed(speed: number): void {
        this.speed -= speed;
        if (this.speed < 0.025) {
            this.speed = 0.025;
        }
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