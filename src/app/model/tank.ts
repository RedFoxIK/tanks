import {Subject} from "rxjs";
import {MovableBoardElement, Point} from "./boardElement";
import {Direction} from "./direction";
import {BoardSprite} from "./spriteWrapper";

export class Tank extends MovableBoardElement {
    public static INITIAL_SPEED = 0.05;

    public readonly startX: number;
    public readonly startY: number;
    public readonly tankType: TankType;
    public readonly bullet: Bullet;

    public lifeTaken$: Subject<Tank>;

    private lifeAmount: number;
    private isImmortal: boolean;
    private initialSpeed: number;

    constructor(boardSprite: BoardSprite, tankType: TankType, bulletSprite: BoardSprite) {
        const direction = Direction.NONE;
        const speed = tankType === TankType.PLAYER ? Tank.INITIAL_SPEED : Tank.INITIAL_SPEED / 2;
        super(boardSprite, true, speed, direction);

        this.startX = boardSprite.boardX;
        this.startY = boardSprite.boardY;

        this.tankType = tankType;
        this.bullet = new Bullet(bulletSprite);

        this.lifeAmount = 1;
        this.isImmortal = false;
        this.initialSpeed = speed;

        if (tankType === TankType.ENEMY) {
            this.boardSprite.sprite.rotation = Direction.DOWN;
        }
        this.lifeTaken$ = new Subject<Tank>();
    }

    public setInitialSpeed() {
        this.speed = this.initialSpeed;
    }

    public activateBullet(): boolean {
        if (!this.bullet.isActive()) {
            const bulletDirection = this.getDirection() !== Direction.NONE ? this.getDirection() :
                this.resolveDirectionByRotation(this.boardSprite.sprite.rotation);
            this.bullet.activate(new Point(this.boardSprite.boardX, this.boardSprite.boardY), bulletDirection);
            return true;
        }
        return false;
    }

    public moveBullet(): Point {
        if (this.bullet.isActive()) {
            const newPoint = this.bullet.retrieveNextMovement();
            this.bullet.move(newPoint);
        }
        return null;
    }

    public getBullet() {
        return this.bullet;
    }

    public addLife(): void {
        this.lifeAmount += 1;
    }

    public takeLife(): void {
        this.lifeAmount -= 1;
        this.lifeTaken$.next(this);
    }

    public takeWound(): boolean {
        if (!this.isImmortal) {
            this.takeLife();
            return true;
        }
        return false;
    }

    public isDead(): boolean {
        return this.lifeAmount <= 0;
    }

    public increaseSpeed(): void {
        this.speed = this.initialSpeed * 2;
    }

    public decreaseSpeed(): void {
        this.speed = this.initialSpeed / 2;
    }

    public makeImmortal() {
        this.isImmortal = true;
    }

    public takeAwayImmortal() {
        this.isImmortal = false;
    }
}

export enum TankType {
    PLAYER, ENEMY,
}

export class Bullet extends MovableBoardElement {
    public killTank$: Subject<Tank>;
    public explode$: Subject<Bullet>;

    constructor(boardSprite: BoardSprite) {
        super(boardSprite, true, 0.15, Direction.NONE);

        this.killTank$ = new Subject<Tank>();
        this.explode$ = new Subject<Bullet>();
    }

    public activate(point: Point, direction: Direction) {
        this.setDirection(direction);
        this.move(point);
    }

    public explode() {
        this.removeFromBoard();
    }

    public isActive() {
        return this.isElemOnBoard();
    }

    public retrieveNextMovement(): Point | null {
        if (this.isActive()) {
            return super.retrieveNextMovement();
        }
        return null;
    }
}
