import {Tank} from "./tank";
import {BoardElement} from "./boardElement";
import {BoardSprite} from "./spriteWrapper";

export abstract class Bonus extends BoardElement {
    firstTick: number;
    lifeTick: number;

    protected tank: Tank;

    private lastTicks = 200;
    private appliedTicks = 300;

    protected constructor(boardSprite: BoardSprite, firstTick: number, lifeTick: number) {
        super(boardSprite, false, false, true);
        this.firstTick = firstTick;
        this.lifeTick = lifeTick;
        this.boardSprite.sprite.zIndex = 100;
    }

    abstract apply(tank: Tank): void;
    abstract finishEffect(): void;

    isActive(tick: number) {
        return tick < this.firstTick + this.lifeTick;
    }

    isAlmostGone(tick: number): boolean {
        return this.isActive(tick) && tick > this.firstTick + this.lifeTick - this.lastTicks;
    }

    isFinished() {
        this.appliedTicks--;
        if (this.appliedTicks <= 0) {
            this.finishEffect();
            return true;
        }
        return false;
    }
}

export class Shield extends Bonus {

    constructor(boardSprite: BoardSprite, firstTick: number) {
        super(boardSprite, firstTick, 450);
    }

    apply(tank: Tank): void {
        this.tank = tank;
        tank.makeImmortal();
    }

    finishEffect(): void {
        this.tank.takeAwayImmortal();
    }
}

export class Life extends Bonus {

    constructor(boardSprite: BoardSprite, firstTick: number) {
        super(boardSprite, firstTick, 450);
    }

    apply(tank: Tank): void {
        tank.addLife();
    }

    finishEffect(): void {}
}

export class Snail extends Bonus {

    constructor(boardSprite: BoardSprite, firstTick: number) {
        super(boardSprite, firstTick, 600);
    }

    apply(tank: Tank): void {
        this.tank = tank;
        tank.decreaseSpeed(0.025);
    }

    finishEffect(): void {
        this.tank.increaseSpeed(0.025);
    }
}

export class Speed extends Bonus {

    constructor(boardSprite: BoardSprite, firstTick: number) {
        super(boardSprite, firstTick, 450);
    }

    apply(tank: Tank): void {
        this.tank = tank;
        console.log('SPEED INCREASED')
        tank.increaseSpeed(0.05);
    }

    finishEffect(): void {
        console.log('SPEED DECREASED')
        this.tank.decreaseSpeed(0.05);
    }
}

export enum BonusType {
    SHIELD,
    LIFE,
    SNAIL,
    SPEED
}