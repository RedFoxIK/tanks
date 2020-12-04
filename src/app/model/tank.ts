import {MovableBoardElement} from "./boardElement";
import {BoardSprite, SpriteWrapper} from "./spriteWrapper";

export class Tank extends MovableBoardElement {
    readonly startX: number;
    readonly startY: number;

    private lifeAmount: number;
    private isImmortal: boolean;

    readonly tankType: TankType;

    constructor(boardSprite: BoardSprite, tankType: TankType) {
        super(boardSprite, true, 2);

        this.startX = boardSprite.sprite.x;
        this.startY = boardSprite.sprite.y;

        this.tankType = tankType;

        this.lifeAmount = 1;
        this.isImmortal = false;
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
