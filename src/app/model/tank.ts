import {MovableBoardElement, Point} from "./boardElement";
import {BoardSprite} from "./spriteWrapper";
import {Direction} from "./direction";
import {Subject} from "rxjs";

export class Tank extends MovableBoardElement {
    static INITIAL_SPEED = 0.05;

    readonly startX: number;
    readonly startY: number;

    private lifeAmount: number;
    private isImmortal: boolean;

    readonly tankType: TankType;
    readonly bullet: Bullet;

    lifeTaken$: Subject<Tank>;

    constructor(boardSprite: BoardSprite, tankType: TankType, bulletSprite: BoardSprite) {
        const direction = Direction.NONE;
        super(boardSprite, true, Tank.INITIAL_SPEED, direction);

        this.startX = boardSprite.boardX;
        this.startY = boardSprite.boardY;

        this.tankType = tankType;
        this.bullet = new Bullet(bulletSprite)

        this.lifeAmount = 1;
        this.isImmortal = false;

        if (tankType === TankType.ENEMY) {
            this.boardSprite.sprite.rotation = Direction.DOWN;
        }
        this.lifeTaken$ = new Subject<Tank>();
    }

    setInitialSpeed() {
        this.speed = Tank.INITIAL_SPEED;
    }

    activateBullet(): boolean {
        if (!this.bullet.isActive()) {
            const bulletDirection = this.getDirection() !== Direction.NONE ? this.getDirection() :
                this.resolveDirectionByRotation(this.boardSprite.sprite.rotation);
            this.bullet.activate(new Point(this.boardSprite.boardX, this.boardSprite.boardY), bulletDirection);
            return true
        }
        return false;
    }

    moveBullet(): Point {
        if (this.bullet.isActive()) {
            const newPoint = this.bullet.retrieveNextMovement();
            this.bullet.move(newPoint);
        }
        return null;
    }

    getBulletDirection() {
        return this.bullet ? this.bullet.getDirection() : Direction.NONE;
    }

    explodeBullet(): void {
        this.bullet.explode();
    }

    getBullet() {
        return this.bullet;
    }

    addLife(): void {
        this.lifeAmount += 1;
    }

    takeLife(): void {
        this.lifeAmount -= 1;
        this.lifeTaken$.next(this);
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
    explode$: Subject<Tank>;

    constructor(boardSprite: BoardSprite) {
        super(boardSprite, true, 0.15, Direction.NONE);
    }

    activate(point: Point, direction: Direction) {
        this.setDirection(direction);
        this.move(point);
    }

    explode() {
        return this.removeFromBoard();
    }

    isActive() {
        return this.isElemOnBoard();
    }

    retrieveNextMovement(): Point | null {
        if (this.isActive()) {
            return super.retrieveNextMovement();
        }
        return null;
    }
}